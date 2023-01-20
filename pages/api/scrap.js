const puppeteer = require("puppeteer");
const fs = require("fs");

async function handleScraping(req, res) {
  // Assign the url that frontend is sending to backend to a variable
  const incomingInputUrl = "https://www.amazon.in/s?k=";
  const search=req.body.search
  console.log(search)
  const inputURL = String(incomingInputUrl).concat(search);
  // We need to pass the URL to Puppeteer so it can begin scrapping off that page
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  const productNameSelector = "div:not(.AdHolder).s-asin h2 a";
  const linkSelector = "div:not(.AdHolder).s-asin h2 a";
  const priceSelector = "div:not(.AdHolder).s-asin .a-price-whole ";
  const imageSelector ="div:not(.AdHolder).s-asin img.s-image"
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );
  await page.goto(inputURL);

  await Promise.all([
    await page.mainFrame().waitForSelector(productNameSelector),
    await page.mainFrame().waitForSelector(priceSelector),
    await page.mainFrame().waitForSelector(linkSelector),
    await page.mainFrame().waitForSelector(imageSelector),
  ]).catch(function (error) {
    console.log(error);
  });
  console.log("ok")

  var productName = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div:not(.AdHolder) .s-asin  h2 a")).map(x => x.textContent)
  })

  var productPrice = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div:not(.AdHolder) .s-asin .a-price-whole ")).map(x => x.textContent)
  })

  var productLink = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div:not(.AdHolder) .s-asin h2 a")).map(x => x.href)
  })
  
  var productImg = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div:not(.AdHolder) .s-asin  img.s-image")).map(x => x.src)
  })
  console.log("ok")
  var i = 0
  fs.writeFileSync("search.json", "[")
  while (i < productName.length) {

    var key =i.toString()
    var title =productName[i] ? productName[i].replace('"','inch ') : " ";
    if(!(title.search("Vevo"))){
      i = i + 1
      continue
      
    }
    else{
    var link =productLink[i].slice(0, productLink[i].lastIndexOf('/'));
    var image =productImg[i]
    var mrp =productPrice[i]
    fs.appendFileSync("./search.json", '{')
    fs.appendFileSync("./search.json", '"key":"'.concat(key))
    fs.appendFileSync("./search.json", '","title":"'.concat(title))
    fs.appendFileSync("./search.json", '","link":"'.concat(link).concat("/sr=8-3&linkCode=ll1&tag=budgetm-21&linkId=afc5f3d92549b8dcc971bfd1825e70e3&language=en_IN&ref_=as_li_ss_tl"))
    fs.appendFileSync("./search.json", '","image":"'.concat(image))
    fs.appendFileSync("./search.json", '","mrp":"'.concat(mrp))
    fs.appendFileSync("./search.json", '","site":"'.concat("amazon"))
    fs.appendFileSync("./search.json", '"}')
    if(i < productName.length-1){fs.appendFileSync("./search.json", ',')}
    i = i + 1}
  };
    await page.goto("https://www.flipkart.com/search?q=".concat(search),{waitUntil:'domcontentloaded',timeout:0})
    console.log("ok1")
    // productName= await page.evaluate(() =>
    // {
    //   if(Array.from(document.querySelectorAll("._4HTuuX")).map( x => x.textContent) != "Ad"){return Array.from(document.querySelectorAll("._13oc-S ._1fQZEK ._4rR01T ")).map( x => x.textContent)}
    // })
    // console.log("ok2")
    // productLink = await page.evaluate(() =>
    // {
    //   if(Array.from(document.querySelectorAll("._4HTuuX")).map( x => x.textContent) != "Ad"){return Array.from(document.querySelectorAll("a:has( >div._13oc-S)")).map( x => x.href)}
    // })
    const fetchcode = await page.$eval("script#jsonLD",x => x.innerHTML)
    const code = JSON.parse(fetchcode)
    productPrice = await page.evaluate(() =>
    {
     return Array.from(document.querySelectorAll("._13oc-S ._25b18c ._30jeq3")).map( x => x.textContent)
    })
    console.log("ok4")
    productImg = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('._13oc-S div img[alt=""]')).map(x => x.src)
    })
    console.log(productImg[0])
    if(productImg[0] === undefined){
      productImg = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img._396cs4')).map(x => x.src)
    })
  }
    var p=0
    while(p < code.itemListElement.length){
      productName[p]= JSON.stringify(code.itemListElement[p].name)
      productLink[p]= JSON.stringify(code.itemListElement[p].url)

  p=p+1
}
  await browser.close();
  console.log("ok")
var m=0
  while (m < p ) {
    key =i.toString()
    title =productName[m] 
    // ? productName[i].replace('"','inch ') : " ";
    link =productLink[m]
    image =productImg[m]
    mrp =productPrice[m]
    fs.appendFileSync("./search.json", ',{')
    fs.appendFileSync("./search.json", '"key":'.concat(key))
    fs.appendFileSync("./search.json", ',"title":'.concat(title))
    fs.appendFileSync("./search.json", ',"link":'.concat(link))
    fs.appendFileSync("./search.json", ',"image":"'.concat(image))
    fs.appendFileSync("./search.json", '","mrp":"'.concat(mrp))
    fs.appendFileSync("./search.json", '","site":"'.concat("flipkart"))
    fs.appendFileSync("./search.json", '"}')
    i = i + 1
    m=m+1
  };
  fs.appendFileSync("./search.json", "]")
  
}

module.exports = handleScraping;
