# Affiliate products via External URL (admin guide)

## What this does
Lets you mark a Shopify product as “affiliate/external” using a single metafield. When set, the storefront sends users to the partner site instead of the internal PDP and replaces price UI with a localized label.

## Metafield definition (once per store)
Location: Shopify Admin → Settings → Custom data → Products → Add definition

• Name: External URL  
• Namespace and key: custom.external_url  
• Type: URL  
• Expose to Storefront API: enabled

Save the definition.

## Mark a product as external
Open a product in Shopify → below, Metafields → External URL → paste the partner product URL (https or http). Save.

To revert a product back to normal, clear the External URL value and save.

## How it changes the storefront
PLP and Collections
• If External URL exists: the product card is an external link that opens in a new tab and shows a label instead of price.  
• rel attribute: nofollow sponsored noopener  
• Labels:  
  – English: See price on partner site  
  – Swedish: Se pris hos partner

• If External URL is empty: normal internal link; price is shown.

PDP
• If External URL exists: price and VAT note are hidden and the checkout form is removed. A single outbound CTA opens in a new tab with rel nofollow sponsored noopener.  
• If External URL is empty: normal PDP with price, VAT note, and checkout form.

## Translations
Text keys live in src/messages/en.json and src/messages/sv.json

• partner_price_label  
EN: See price on partner site  
SV: Se pris hos partner

## Analytics and SEO follow-ups
• Outbound click tracking and standardized UTMs are tracked in issue #41.  
• JSON-LD adjustments for affiliate offers are tracked in issue #42.  
• Reviews/AggregateRating inclusion is tracked in issue #18.

## QA checklist (per locale)
1. PLP: a product with External URL opens partner in a new tab and shows the label; other products show a price and route internally.  
2. Collections: same behavior as PLP.  
3. PDP (external): price and checkout hidden; single outbound CTA with rel nofollow sponsored noopener.  
4. PDP (internal): price, VAT note, and checkout present.

## Troubleshooting
• External link doesn’t appear: confirm the product has a valid URL in External URL and that the metafield definition is exposed to the Storefront API.  
• Price still shows on external items: hard refresh; confirm the product/page query is hitting the Storefront API and that custom.external_url has a value.  
• Want to switch back: clear External URL and save; storefront reverts to internal behavior.