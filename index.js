const axios = require('axios');   // ajax 라이브러리
const cheerio = require('cheerio'); // html 파싱 라이브러리
const parse = require('csv-parse/lib/sync')  // csv parser 
const fs = require('fs');

const csv = fs.readFileSync('csv/data.csv');
// const file = fs.writeFile('csv/file.txt');
const records = parse(csv.toString('utf-8'));
records.forEach((r, i) => {
    console.log(i, r[0]+'-'+r[1]);
});

const crawler = async () => {
    await Promise.all(records.map(async (r) => {
        // const response = await axios.get('https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266');
        const response = await axios.get(encodeURI('https://playoverwatch.com/ko-kr/search/account-by-name/tira'));  //r[0]+'#'+r[1]
        if(response.status === 200) {
            const html = JSON.stringify(response.data, undefined, 2);
            // console.log(html);
            // const $ = cheerio.load(html);
            // const text = $('.score.score_left .star_score').text();
            // console.log('평점', text.trim()); 
            fs.writeFile('csv/file.txt', html, (err) => {
                if(err) throw err;
                console.log('the file has been saved!');
            });
        }
    }));
};

crawler();