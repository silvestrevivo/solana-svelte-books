use anchor_lang::prelude::*;

declare_id!("FB5U8m8DBbYBnF6oqzgM7tc2YKpgNicwZvWfZSdKoV7d");

#[program]
pub mod solana_svelte_books {
    use super::*;

    pub fn add_entry(ctx: Context<AddEntry>, title: String, author: String) -> Result<()> {
        let entry_book = &mut ctx.accounts.entry_book;
        entry_book.title = title;
        entry_book.author = author;
        Ok(())
    }

    pub fn modify_author(ctx: Context<ModifyAuthor>, author: String) -> Result<()> {
        let entry_book = &mut ctx.accounts.entry_book;
        entry_book.author = author;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddEntry<'info> {
    #[account(init, payer = user, space = EntryBook::LEN)]
    pub entry_book: Account<'info, EntryBook>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct ModifyAuthor<'info> {
    #[account(mut)]
    pub entry_book: Account<'info, EntryBook>,
}


#[account]
#[derive(Default)]
pub struct EntryBook {
    title: String,
    author: String
}


const DISCRIMINATOR_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4;
const MAX_STRING_LENGTH: usize = 100 * 4;

impl EntryBook {
    const LEN: usize =DISCRIMINATOR_LENGTH + (STRING_LENGTH_PREFIX  + MAX_STRING_LENGTH) * 2;
}
