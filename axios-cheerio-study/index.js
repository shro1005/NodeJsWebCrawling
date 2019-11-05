const axios = require('axios');   // ajax 라이브러리
const cheerio = require('cheerio'); // html 파싱 라이브러리
const parse = require('csv-parse/lib/sync')  // csv parser 
const fs = require('fs');

const csv = fs.readFileSync('axios-cheerio-study/csv/data.csv');
// const file = fs.writeFile('csv/file.txt');
const records = parse(csv.toString('utf-8'));
records.forEach((r, i) => {
    console.log(i, r[0]+'-'+r[1]);
});

const crawler = async () => {
    /** Promise.all 의 경우 비동기 이기 때문에 순서가 지켜지지 않는다. (대신 빠르게 처리 가능)
     *  for of 문을 사용하면 동기화하여 순서대로 데이터를 크롤링 해올 수 있다. (다만 더 느리다.)
     * */
    // for (const[i, r] of records.entries()) { /* 내용 */}    // for문 사용시 다음과 같이 사용하면 된다.
    await Promise.all(records.map(async (r) => {
        const URL = 'https://playoverwatch.com/ko-kr/search/account-by-name/'+r[0]+'#'+r[1];
        const response = await axios.get(encodeURI(URL));  
        if(response.status === 200) {
            const html = JSON.stringify(response.data, undefined, 2);
            // console.log(html);
            // const $ = cheerio.load(html);
            // const text = $('.score.score_left .star_score').text();
            // console.log('평점', text.trim()); 
            fs.writeFile('csv/'+r[0]+'.txt', html, (err) => {
                if(err) throw err;
                console.log('the file has been saved!');
                // console.log('https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/'+ 'portrait'+ '.png');
            });
            const datas = response.data;
            // console.log(datas);
            datas.forEach(function(data){
                var imgUrl = 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/'+data.portrait+'.png';
                // const imgResponse = axios.get(encodeURI(imgUrl));
                // if(imgResponse.status === 200) {
                    console.log(imgUrl);    
                // }else {
                //     data.portrait = '0x02500000000002F7';
                //     imgUrl = 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/'+data.portrait+'.png';
                // }  
            });
            console.log('============================='+r[0]+'끝====================================');          
        }
    }));
};

crawler();