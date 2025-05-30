# Apollo Backend Scraper

Simple Apify actor that sends Apollo search URLs to your backend API and returns the scraped leads.

## Features

✅ **Simple Setup** - Just provide your Apollo search URL  
✅ **Backend Integration** - Connects to your existing scraping backend  
✅ **Real-time Status** - Shows scraping progress and results  
✅ **Data Export** - Saves all leads to Apify dataset  
✅ **Error Handling** - Proper error messages and logging  

## How to Use

1. **Get Apollo Search URL**: Go to Apollo.io, set up your search filters, and copy the URL
2. **Run Actor**: Paste the URL into the actor input
3. **Wait for Results**: The actor will send the URL to your backend and wait for leads
4. **Download Data**: Export leads from the dataset when complete

## Input

- **Apollo Search URL** (required): The Apollo.io search URL you want to scrape
- **Backend URL** (optional): Your webhook URL (defaults to your endpoint)

## Output

The actor saves all leads to the dataset with fields like:
- Name
- Email  
- Phone
- Company
- Title
- And other available data

## Backend Integration

This actor sends a POST request to your backend with the Apollo URL:

```json
{
    "url": "https://app.apollo.io/#/people...",
    "timestamp": "2025-05-30T...",
    "source": "apify-actor"
}
Your backend should return leads in JSON format.
Pricing
$1.00 per 1,000 leads - Simple, transparent pricing with no hidden fees.
Support
For issues or questions, please create an issue in the actor repository.
