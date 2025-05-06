'use server'

import {auth, signIn, signOut} from "@/auth";

export const signInWithNaver = async () => {
    await signIn('naver');
}

export const signOutWithForm = async () => {
    await signOut();
}

export {
    auth as getSession,
}