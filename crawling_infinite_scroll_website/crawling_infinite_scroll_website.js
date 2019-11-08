const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const crawling_infinite_scroll_website = async () => {
    try{
        const browser = await puppeteer.launch({
            headless: false,
            // args: ['--window-size=1920,1080']    // 브라우저 사이즈 설정
        });
        const page = await browser.newPage();
        // await page.setViewport({   // 화면 사이즈 설정
        //     width:1920,
        //     height:1080
        // });
        await page.goto("https://unsplash.com");
        let results = [];
        while (results.length <= 20) {
            const imgs_url = await page.evaluate(() => {
                window.scrollTo(0,0);
                let imgs =[];
                // 이미지 컨테이너를 얻고 각 이미지 컨테이너속 이미지의 src에 접근해 url을 얻는다. 이후 해당 컨테이너 삭제
                const imgContainers = document.querySelectorAll('.IEpfq');
                if (imgContainers.length) {
                    imgContainers.forEach((imgContainer) => {
                        let img_src = imgContainer.querySelector('img._2zEKz').src;
                        if (img_src) {
                            imgs.push(img_src);
                        }
                        imgContainer.parentElement.removeChild(imgContainer);   // 이미지 주소를 얻어오면 해당 이미지를 지운다 => 어떤 이미지를 크롤링했는지 확인하기 위함
                    });
                }
                window.scrollBy(0, 100); // 스크롤 조작 메소드 > 세로로 100픽셀 내린 효과;
                setTimeout(() => {
                    window.scrollBy(0, 150);  // scrollBy : 상대좌표 / scrollTo : 절대좌표
                }, 500);
                return imgs;
            });
            results = results.concat(imgs_url);
            //다음 이미지들이 로딩되는 것을 기다린다
            await page.waitForSelector('.IEpfq');
            console.log("태그 로딩 완료");
        }
        console.log(results);
        await page.close();
        await browser.close();
    }catch(e) {
        console.error(e);
    }
};

crawling_infinite_scroll_website();