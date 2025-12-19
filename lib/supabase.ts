import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a placeholder client that won't throw if credentials are missing
// This allows the app to run without Supabase configured (for demo/dev purposes)
export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

export const isSupabaseConfigured = !!supabase;

// Message type for TypeScript
export interface Message {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  user_image: string | null;
  content: string;
  event_data: any | null;
  created_at: string;
}

// Helper functions for messages
export async function getMessages(limit = 50): Promise<Message[]> {
  if (!supabase) {
    console.warn('Supabase not configured - using local storage');
    return getLocalMessages();
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching messages:', error);
    return getLocalMessages();
  }

  return data as Message[];
}

export async function sendMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<Message | null> {
  const newMessage: Message = {
    ...message,
    id: `local-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    console.warn('Supabase not configured - using local storage');
    saveLocalMessage(newMessage);
    return newMessage;
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    // Fallback to local storage
    saveLocalMessage(newMessage);
    return newMessage;
  }

  return data as Message;
}

export async function updateMessageEventData(messageId: string, eventData: any): Promise<Message | null> {
  if (!supabase || messageId.startsWith('local-')) {
    // Update local storage
    updateLocalMessageEventData(messageId, eventData);
    return null;
  }

  const { data, error } = await supabase
    .from('messages')
    .update({ event_data: eventData })
    .eq('id', messageId)
    .select()
    .single();

  if (error) {
    console.error('Error updating message event data:', error);
    return null;
  }

  return data as Message;
}

// Local storage helpers for demo/dev mode
const LOCAL_STORAGE_KEY = 'linklens_messages';

function getLocalMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalMessage(message: Message): void {
  if (typeof window === 'undefined') return;
  try {
    const messages = getLocalMessages();
    messages.push(message);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving to local storage:', e);
  }
}

function updateLocalMessageEventData(messageId: string, eventData: any): void {
  if (typeof window === 'undefined') return;
  try {
    const messages = getLocalMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      messages[index].event_data = eventData;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
  } catch (e) {
    console.error('Error updating local storage:', e);
  }
}

