// Pages can contain zero, one or several displays for an asset.
export function paintQuotes(root,copper,gold){
 for(const [selector,quote]of [['[data-market-price]',copper],['[data-gold-price]',gold]])for(const node of root.querySelectorAll(selector))node.textContent=(quote/10000).toFixed(4);
}
