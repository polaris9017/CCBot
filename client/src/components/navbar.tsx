/* Layout from Tailwind UI (https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/stacked) */

'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaUser } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';

const navigation = [{ name: '대시보드', href: '/dashboard', current: false }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const NavBar = () => {
  const { status, data } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const exceptionList = ['/signin', '/chat'];

  const [userNavigation, setUserNavigation] = useState([{ name: '', href: '' }]);
  const [user, setUser] = useState({
    name: '',
    imageUrl: '/fabicon.ico',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      setUserNavigation([{ name: '로그아웃', href: '/api/auth/signout?callbackUrl=/' }]);

      setUser({
        name: data?.user.channelName ?? '',
        imageUrl: data?.user.channelImageUrl ?? '',
      });

      if (pathName === '/') router.push('/dashboard');
    }
  }, [data?.user, status]);

  if (exceptionList.includes(pathName)) return <></>;

  const loginButton = (
    <MenuButton
      className="rounded bg-sky-600 px-4 py-1 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"
      type={'submit'}
    >
      대시보드로 이동
    </MenuButton>
  );
  const loginDisclosureButton = (
    <DisclosureButton
      className="rounded bg-sky-600 px-4 py-1 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"
      type={'submit'}
    >
      대시보드로 이동
    </DisclosureButton>
  );

  return (
    <>
      {status === 'authenticated' && <Sidebar />}
      <Disclosure as="nav" className="bg-gray-800 sticky top-0 w-full z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                {/*<img
                    alt="CCBot"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="size-8"
                  />*/}
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {status === 'authenticated' &&
                    navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/*{status === 'authenticated' && (
                    <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon aria-hidden="true" className="size-6" />
                    </button>
                  )}*/}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    {status === 'authenticated' && (
                      <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        {user.imageUrl ? (
                          <img alt="" src={user.imageUrl} className="size-8 rounded-full" />
                        ) : (
                          <FaUser className="size-6 invert" />
                        )}
                      </MenuButton>
                    )}
                    {status === 'unauthenticated' && <form action="/signin">{loginButton}</form>}
                  </div>

                  {status === 'authenticated' && (
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <a
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                          >
                            {item.name}
                          </a>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  )}
                </Menu>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}

              {status === 'authenticated' && (
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              )}
              {status === 'unauthenticated' && (
                <form action="/signin">{loginDisclosureButton}</form>
              )}
            </div>
          </div>
        </div>

        {status === 'authenticated' && (
          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {status === 'authenticated' &&
                navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-5">
                <div className="shrink-0">
                  {user.imageUrl ? (
                    <img alt="" src={user.imageUrl} className="size-10 rounded-full" />
                  ) : (
                    <FaUser className="size-6 invert" />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base/5 font-medium text-white">{user.name}</div>
                  {/*<div className="text-sm font-medium text-gray-400">{user.email}</div>*/}
                </div>
                {/*<button
                    type="button"
                    className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>*/}
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </div>
          </DisclosurePanel>
        )}
      </Disclosure>
    </>
  );
};
