# Stevie G's Easy-Edit Website

This version is built so business information, menu items, prices, and photos can be edited through a browser-based CMS.

## What is editable
- Homepage headline and intro
- About text
- Address, hours, email
- Instagram / Facebook / online ordering links
- Large homepage photo
- Photo gallery
- Menu sections, items, descriptions, and prices

## One-time setup required
The CMS needs the site connected to a GitHub repository so it has somewhere to save your edits.

1. Create a GitHub account if you don't already have one.
2. Create a repository named `stevie-gs-coffee-company`.
3. Upload all files in this folder to that repository.
4. Edit `admin/config.yml` and replace `YOUR_GITHUB_USERNAME` with your GitHub username.
5. In Netlify, connect the existing site (or a new site) to the GitHub repository and deploy from the `main` branch.
6. Configure GitHub authentication for Decap CMS.
7. Then visit `https://steviegscoffeecompany.netlify.app/admin/` to edit the website.

After setup, changes made in the editor are saved to GitHub and Netlify can redeploy the live site automatically.
