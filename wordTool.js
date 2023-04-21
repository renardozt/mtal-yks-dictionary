console.log("Gerekli Modüller kontrol ediliyor...");

const path = "./src/words.json"; // LÜTFEN KELİMELERİN BULUNDUĞU DOSYAYA YÖNLENDRİNİZ.
const oldWords = require(path);
const { writeFile } = require("fs");
const { get } = require("axios").default;
const { Agent } = require("https");

(async () => {
  try {
    console.log(`HOŞ GELDİNİZ, KONTROL BAŞLATILIYOR...\n`);

    await new Promise((resolve) => setTimeout(resolve, 3 * 1000));

    const httpsAgent = new Agent({
      rejectUnauthorized: false,
    });

    if (typeof oldWords != "object") // OBJECT TÜRÜNÜ KONTROL ET
      return console.error(
        'HATA: Lütfen .JSON dosyası için "ARRAY" verisi sağlayın.\n'
      );

    const words = Array.from(oldWords).filter(Boolean); // OBJECT TÜRÜNÜ ARRAY OLARAK ZORLA VE HATALI VERİLERİ KALDIR

    if (words.length === 0)
      // ARRAY UZUNLUĞUNU KONTROL ET
      return console.error("HATA: Sağlanan ARRAY'da kelime yok!\n");

    // ARRAY İÇERİĞİNİ KONTROL ET
    for (let word of words) {
      if (typeof word != "string")
        return console.log(
          'HATA: Lütfen kelimeler içinde bulunan tüm verileri "STRING" türünden yazınız.\n'
        );
    }

    let sort = words.sort((a, b) => a.localeCompare(b)); // ALFABEYE GÖRE YENIDEN DÜZENLE
    sort = sort.filter((item, index) => sort.indexOf(item) === index); // TEKRARLANAN KELİMELERİ KALDIR

    let remove = [];

    const checkTDK = (index = 0) => {
      return new Promise(async (resolve, reject) => {
        console.log(`Sözcük kontrol ediliyor: ${sort[index]}`);

        get(`https://sozluk.gov.tr/gts?ara=${decodeURI(sort[index])}`, {
          httpsAgent,
        })
          .then((req) => {
            if (req?.data.error) remove.push(sort[index]); // UYUMSUZ SÖZCÜKLERİ BUL

            if (index == sort.length - 1) {
              if (remove.length > 0) {
                console.log(
                  `\nBulunan Uyumsuz Sözcükler:\n${remove.join("\n")}\n`
                );
                console.log("Sözcükler otomatik olarak kaldırıldı!");
              }

              let removed = sort.filter((w) => !remove.includes(w)); // UYUMSUZ SÖZCÜKLERİ KALDIR
              writeWords(removed);

              return;
            }

            checkTDK(index + 1);
            resolve(sort[index]);
          })
          .catch(reject);
      });
    };

    checkTDK();

    function writeWords(words) {
      if (!words)
        return console.error("KRİTİK HATA: Kelime verisi bulunamadı!");

      let wordsToString = JSON.stringify(words); // VERI UYUMLULUĞU IÇIN TEKRAR DÜZENLE

      writeFile(path, wordsToString, "utf8", (err) => {
        if (!!err)
          return console.error(
            `HATA: Dosyanın güncellenmesinde bir hata meydana geldi!\n${err}`
          );

        console.log(
          `\nİşlem tamamlandı, .JSON dosyası içinde bulunan ${words.length} tane kelime düzenlendi.\n`
        );
      });
    }
  } catch (err) {
    console.error(`BEKLENMEDİK BİR HATA MEYDANA GELDİ:\n${err}`);
  }
})();
