# Hostinger Deployment Guide

## Pre-deployment Checklist

- [x] .htaccess file created
- [x] contact-handler.php created
- [x] JavaScript updated for PHP form handling
- [ ] Remove _headers file
- [ ] Remove _redirects file
- [ ] Update email address in contact-handler.php

## Deployment Steps

1. **Access Hostinger Control Panel**
   - Log into your Hostinger account
   - Navigate to File Manager

2. **Upload Files**
   - Upload all files to `public_html` directory
   - Ensure .htaccess is in the root directory
   - Set permissions for contact-handler.php (644)

3. **Configure Domain**
   - Point your domain to Hostinger nameservers
   - Configure DNS settings if needed

4. **Enable SSL**
   - Activate free SSL certificate in control panel
   - Force HTTPS redirects (handled by .htaccess)

5. **Test Functionality**
   - Test contact forms
   - Verify all pages load correctly
   - Check mobile responsiveness
   - Test performance with GTmetrix

## Post-deployment Tasks

- Update Google Analytics domain
- Submit sitemap to Google Search Console
- Test email delivery
- Monitor error logs

## Files to Remove Before Upload

- `_headers` (Netlify specific)
- `_redirects` (Netlify specific)
- `HOSTINGER-DEPLOY.md` (this file)