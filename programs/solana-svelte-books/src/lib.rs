use anchor_lang::prelude::*;

declare_id!("FB5U8m8DBbYBnF6oqzgM7tc2YKpgNicwZvWfZSdKoV7d");

#[program]
pub mod solana_svelte_books {
    use super::*;

    pub fn create_entry(ctx: Context<CreateEntry>, title: String, author: String) -> Result<()> {
        let book_account = &mut ctx.accounts.book_account;
        book_account.title = title;
        book_account.author = author;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEntry<'info> {
    #[account(init, payer = payer, space = 100)]
    pub book_account: Account<'info, BookAccount>,
    #[account[mut]]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BookAccount {
    pub title: String,
    pub author: String,
}
