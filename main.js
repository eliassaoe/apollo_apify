const Apify = require('apify');

Apify.main(async () => {
    console.log('Starting Apollo Backend Scraper...');
    
    // Get input
    const input = await Apify.getInput();
    
    if (!input || !input.apolloUrl) {
        throw new Error('Apollo URL is required!');
    }
    
    const apolloUrl = input.apolloUrl.trim();
    const backendUrl = input.backendUrl || 'https://eliasse-n8n.onrender.com/webhook/apify';
    
    console.log(`Apollo URL: ${apolloUrl}`);
    console.log(`Backend URL: ${backendUrl}`);
    
    // Validate Apollo URL
    if (!apolloUrl.includes('apollo.io')) {
        throw new Error('Please provide a valid Apollo.io URL');
    }
    
    try {
        console.log('🚀 Sending Apollo URL to backend for scraping...');
        console.log('⏳ Scraping leads in progress - please wait...');
        
        // Send POST request to backend
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: apolloUrl,
                timestamp: new Date().toISOString(),
                source: 'apify-actor'
            })
        });
        
        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Successfully received response from backend!');
        
        // Process the leads
        let leads = [];
        
        if (result.leads && Array.isArray(result.leads)) {
            leads = result.leads;
            console.log(`📊 Found ${leads.length} leads`);
        } else if (result.data && Array.isArray(result.data)) {
            leads = result.data;
            console.log(`📊 Found ${leads.length} leads`);
        } else if (Array.isArray(result)) {
            leads = result;
            console.log(`📊 Found ${leads.length} leads`);
        } else {
            console.log('⚠️ No leads array found in response, saving entire response');
            leads = [result];
        }
        
        // Save leads to dataset
        if (leads.length > 0) {
            await Apify.pushData(leads);
            
            // Log some sample data
            console.log('📋 Sample leads:');
            leads.slice(0, 3).forEach((lead, index) => {
                console.log(`${index + 1}. ${lead.name || lead.full_name || 'N/A'} - ${lead.email || 'No email'} - ${lead.company || lead.organization || 'No company'}`);
            });
            
            if (leads.length > 3) {
                console.log(`... and ${leads.length - 3} more leads`);
            }
        }
        
        // Final summary
        console.log('\n🎉 Scraping completed successfully!');
        console.log(`✨ Total leads scraped: ${leads.length}`);
        console.log('💾 All leads have been saved to the dataset');
        
        // Set actor output
        await Apify.setValue('OUTPUT', {
            success: true,
            totalLeads: leads.length,
            apolloUrl: apolloUrl,
            timestamp: new Date().toISOString(),
            message: `Successfully scraped ${leads.length} leads from Apollo via backend API`
        });
        
    } catch (error) {
        console.error('❌ Error occurred:', error.message);
        
        // Save error info
        await Apify.setValue('OUTPUT', {
            success: false,
            error: error.message,
            apolloUrl: apolloUrl,
            timestamp: new Date().toISOString()
        });
        
        throw error;
    }
});
