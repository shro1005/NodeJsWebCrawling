const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');
const puppeteer = require('puppeteer');

const csv = fs.readFileSync('puppeteer-study/csv_puppeteer/data.csv');
const records = parse(csv.toString('utf-8'));

const puppeteer_crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({headless: false});
    await Promise.all(records.map(async (r, i) => {
      try {
        const page = await browser.newPage();
        // console.log(r[0] + " / " + r[1]);
        await page.goto(r[1]);

        const raw = await page.evaluate(() => {
          let specialListPoint = document.querySelector('.mv_info_area .spc .star_score');
          let netizenPoint = document.querySelector('.score.score_left .star_score');

          if(specialListPoint != null) {
            specialListPoint = specialListPoint.textContent.trim();
          }
          if(netizenPoint != null) {
            netizenPoint = netizenPoint.textContent.trim();
          }
          return {
            specialListPoint : specialListPoint,
            netizenPoint : netizenPoint
          };
         });
        if(raw) {
          console.log(r[0] +" / 전문가 평점 : "+ raw.specialListPoint +" / 네티즌 평점 : "+ raw.netizenPoint);
          result[i] = [r[0], r[1], raw.specialListPoint, raw.netizenPoint];
        }
        // const scoreEl = await page.$('.score.score_left .star_score');
        // if (scoreEl) {
        //   const text = await page.evaluate(tag => tag.textContent, scoreEl);
        //   /** evaluate() 메소드 : 해당 페이지에서 태그을 찾아 태그의 텍스트 or attribute 등을 가져 올 수 있다.*/
        //   console.log(r[0] + " 평점 : " +text.trim());
        //   // result.push([r[0], r[1], text.trim()]);  // 순서 보정 안됨
        //   result[i] = [r[0], r[1], text.trim()];   // 순서 보정
        // }
        await page.close();
      }catch (e) {
        console.log(e);
      }
    }));
    await browser.close();
    const str = stringify(result);
    fs.writeFileSync('puppeteer-study/csv_puppeteer/result2.csv', str);
  }catch (e) {
    console.log(e);
  }
};

puppeteer_crawler();