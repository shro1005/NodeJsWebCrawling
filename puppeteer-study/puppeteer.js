const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const puppeteer = require('puppeteer');

fs.readdir('poster', (err) => {
  if(err) {
    console.error("poster 폴더가 존재하지 않아 poster 폴더를 먼저 생성합니다.");
    fs.mkdirSync('poster');
  }
});
fs.readdir('screenshot', (err) => {
  if(err) {
    console.error("screenshot 폴더가 존재하지 않아 screenshot 폴더를 먼저 생성합니다.");
    fs.mkdirSync('screenshot');
  }
});


const csv = fs.readFileSync('csv_puppeteer/data.csv');
const records = parse(csv.toString('utf-8'));

const puppeteer_crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=1920,1080']    // 브라우저 사이즈 설정
    });
    await Promise.all(records.map(async (r, i) => {
      try {
        const page = await browser.newPage();
        await page.setViewport({   // 화면 사이즈 설정
          width:1920,
          height:1080
        });
        // console.log(r[0] + " / " + r[1]);
        await page.goto(r[1]);

        const raw = await page.evaluate(() => {
          let specialListPoint = document.querySelector('.mv_info_area .spc .star_score');
          let netizenPoint = document.querySelector('.score.score_left .star_score');
          let poster = document.querySelector('.poster img');  // 이미지 주소가 있는 태그 저장
          if(specialListPoint != null) {
            specialListPoint = specialListPoint.textContent.trim();
          }
          if(netizenPoint != null) {
            netizenPoint = netizenPoint.textContent.trim();
          }
          if(poster != null) {
            poster = poster.src;   // 이미지 주소가 있는 src의 내용 저장
          }
          return {
            specialListPoint : specialListPoint,
            netizenPoint : netizenPoint,
            poster : poster
          };
         });
        // console.log("===================="+r[0]+ "(" + r[1] + ")====================");
        console.log(r[0] +" / 전문가 평점 : "+ raw.specialListPoint +" / 네티즌 평점 : "+ raw.netizenPoint);
        result[i] = [r[0], r[1], raw.specialListPoint, raw.netizenPoint];

        if(raw.poster) {
          const imgResult = await axios.get(raw.poster /**.replace(/\?.*$/, '')*/, {  // axios를 이용해 이미지 주소의 데이터를 저장
            responseType: 'arraybuffer',
          });
          fs.writeFileSync('poster/'+r[0]+'.jpg', imgResult.data);    // 저장한 이미지 데이터를 원하는 파일에 쓰는 것을 통해 이미지 자체를 우리 폴더로 옮길수 있다.
          /** 스크린샷 저장*/
          await page.screenshot({
            path: 'screenshot/'+r[0]+'_스크린샷.png',
            // fullPage : true,   // full page 스크린샷
            clip: {               // 일부 영역만 스크린샷
              x: 220,
              y: 150,
              width: 110,
              height: 120
            }
          }); // 스크린샷을 찍고 path에 저장.
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
          console.log(r[0] + " 크롤링중 에러 발생 !!!");
          console.log(e);
      }
    }));
    await browser.close();
    const str = stringify(result);
    fs.writeFileSync('csv_puppeteer/result2.csv', str);
  }catch (e) {
    console.log(e);
  }
};

puppeteer_crawler();