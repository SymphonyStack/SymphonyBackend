import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const channel = supabase
    .channel('schema-db-changes')
    .on(
        'postgres_changes', {
            event: 'INSERT',
            schema: 'public',
        },
        (payload) => console.log(payload)
    )
    .subscribe()