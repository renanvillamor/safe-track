import { supabase } from "../lib/supabase";

export interface SignInResult {
  userId: string;
  email: string;
}

export async function signInWithPassword(email: string, password: string): Promise<SignInResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("Sign in did not return a user.");
  return { userId: data.user.id, email: data.user.email ?? email };
}

export async function signUpGuardian(fullName: string, email: string, password: string): Promise<SignInResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "guardian" } },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Registration did not return a user.");
  return { userId: data.user.id, email: data.user.email ?? email };
}

export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
