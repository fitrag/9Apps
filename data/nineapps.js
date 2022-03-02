const cors = require("cors");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/nineapps/best-quality", (req, res) => {
  let url = "https://www.9apps.com/id/";
  try {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const main = $(".list-wrap");

        let obj = {};
        let data = [];

        main.find("#refreshList").each((id, el) => {
          const judul = $(el)
            .find(".section:nth-child(3) > .section-title > .title")
            .find(".single-title")
            .text();
          obj.judul = judul;
        });
        obj.status = 200;

        main
          .find(
            "#refreshList > .section:nth-child(3) > .panel-bd > .section-content > .item"
          )
          .each((id, el) => {
            const nama = $(el)
              .find(".app-item-column > .app-inner > .info")
              .find("p.name")
              .text();
            const star = $(el)
              .find(".app-item-column > .app-inner > .info > .other > .stars")
              .find("span.star")
              .text();
            const img = $(el)
              .find(".app-item-column > .app-inner > .pic")
              .find("img")
              .attr("src");
            const link = $(el)
              .find(".app-item-column > .app-inner")
              .attr("href")
              .replace("/id/", "");

            data.push({
              id,
              nama,
              star,
              img,
              link,
            });

            obj.data = data;
          });
        obj.status = 200;

        res.json(obj);
      })
      .catch((err) => {
        res.json({
          message: "Error",
        });
      });
  } catch {
    console.log("Tidak dapat mengambil data");
  }
});

router.get("/nineapps/detail/:category/:slug", async (req, res) => {
  let url =
    "https://www.9apps.com/id/" + req.params.category + "/" + req.params.slug;
  try {
    await axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const main = $(".pc-wrap");

        let obj = {};
        let screenshot = [];
        let othersVersion = [];

        main.find(".section:first-child > dl.ny-dl ").each((id, el) => {
          const judul = $(el).find("dd > .title-like > .name").text().trim();
          const link = $(el)
            .find("dd > .ver-top-down > a.download-app")
            .attr("href")
            .replace("https://www.9apps.com/id/", "")
            .replace("/id/", "");
          const img = $(el).find("dt > .icon > img").attr("src");
          const rating = $(el)
            .find("dd > .details-rating > .rating-info > .rating")
            .text()
            .trim();
          const downloads = $(el)
            .find("dd > .details-rating > .rating-info > .details-to-delimiter")
            .text()
            .replace("Instal", "")
            .trim();
          const author = $(el).find("dd > .details-author").text().trim();

          obj.judul = judul;
          obj.img = img;
          obj.link = link;
          obj.rating = rating;
          obj.downloads = downloads;
          obj.author = author;
        });

        main
          .find(
            ".section:first-child > .describe > .detail-info-section > .detail-left > .detail-info-item"
          )
          .each((id, el) => {
            const description = $(el)
              .find(".desc-wrap > .description-container > p.description")
              .text()
              .trim();

            obj.description = description;
          });

        main
          .find(
            ".section:first-child > .describe > .detail-info-section > .detail-left > .screen-wrap > .detail-info-item > .screen-shot > a.gallery"
          )
          .each((id, el) => {
            const img = $(el).find("img").attr("src");

            screenshot.push({
              id,
              img,
            });
            obj.screenshot = screenshot;
          });

        main
          .find(
            ".section > .detail-info-section > .version-list > .panel-ul > li"
          )
          .each((id, el) => {
            const version = $(el)
              .find(".version-info > .version-title")
              .text()
              .trim();
            const link = $(el).find(".btn-download").attr("href");
            const size = $(el)
              .find(".version-info > .version-size")
              .text()
              .trim();

            othersVersion.push({
              id,
              version,
              size,
              link,
            });

            obj.others_version = othersVersion;
          });

        res.json(obj);
      })
      .catch((err) => {
        res.json({
          status: 404,
          message: "Error",
          author: "Fadila Fitra Kusuma Jaya",
          website: "https://fitlabdev.com",
        });
      });
  } catch {}
});

router.get("/nineapps/downloading/:category/:slug", async (req, res) => {
  let url =
    "https://www.9apps.com/id/downloading/" +
    req.params.category +
    "/" +
    req.params.slug;

  try {
    await axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const body = $("body");
        const main = $(".pc-wrap");

        let obj = {};

        main.find(".pc-left > .sextion-box:first-child").each((id, el) => {
          $(el)
            .find(".downloading-info")
            .find(".pc-btn-download")
            .attr("auto_download")
            .replace("true", "false");
          const link = $(el)
            .find(".downloading-info")
            .find(".pc-btn-download")
            .attr("download_address");

          obj.status = 200;
          obj.link = link;
        });
        res.json(obj);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch {
    res.json({
      status: 404,
      message: "Error",
    });
  }
});

// Endpoint Game
router.get("/nineapps/new-games/:page?", (req, res) => {
  let url = req.params.page
    ? "https://www.9apps.com/id/new-android-games-" + req.params.page
    : "https://www.9apps.com/id/new-android-games-1";

  try {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const main = $(".pc-wrap");

        let data = [];
        main
          .find(".pc-android-right > .cate-list-wrap > .cate-list > li")
          .each((id, el) => {
            const img = $(el)
              .find(".category-template-img > a > img")
              .attr("src");
            const link = $(el)
              .find(".category-template-img > a")
              .attr("href")
              .replace("/id/", "");
            const nama = $(el)
              .find(".category-template-title > a")
              .text()
              .trim();
            const star = $(el).find(".stars > .star").text().trim();
            const link_download = $(el)
              .find(".category-template-down > a.btn-download")
              .attr("href")
              .replace("/id/", "");

            data.push({
              id,
              img,
              link,
              nama,
              star,
              link_download,
            });
          });

        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch {
    console.log("Tidak dapat mengambil data");
  }
});
router.get("/nineapps/most-games/:page?", (req, res) => {
  let url = req.params.page
    ? "https://www.9apps.com/id/android-games-featured-" + req.params.page
    : "https://www.9apps.com/id/android-games-featured";

  try {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const main = $(".pc-wrap");

        let data = [];
        main
          .find(".pc-android-right > .cate-list-wrap > .cate-list > li")
          .each((id, el) => {
            const img = $(el)
              .find(".category-template-img > a > img")
              .attr("src");
            const link = $(el)
              .find(".category-template-img > a")
              .attr("href")
              .replace("/id/", "");
            const nama = $(el)
              .find(".category-template-title > a")
              .text()
              .trim();
            const star = $(el).find(".stars > .star").text().trim();
            const link_download = $(el)
              .find(".category-template-down > a.btn-download")
              .attr("href")
              .replace("/id/", "");

            data.push({
              id,
              img,
              link,
              nama,
              star,
              link_download,
            });
          });

        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch {
    console.log("Tidak dapat mengambil data");
  }
});
router.get("/nineapps/top-games/:page?", (req, res) => {
  let url = req.params.page
    ? "https://www.9apps.com/id/top-android-games-" + req.params.page
    : "https://www.9apps.com/id/top-android-games-1";

  try {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const main = $(".pc-wrap");

        let data = [];
        main
          .find(".pc-android-right > .cate-list-wrap > .cate-list > li")
          .each((id, el) => {
            const img = $(el)
              .find(".category-template-img > a > img")
              .attr("src");
            const link = $(el)
              .find(".category-template-img > a")
              .attr("href")
              .replace("/id/", "");
            const nama = $(el)
              .find(".category-template-title > a")
              .text()
              .trim();
            const star = $(el).find(".stars > .star").text().trim();
            const link_download = $(el)
              .find(".category-template-down > a.btn-download")
              .attr("href")
              .replace("/id/", "");

            data.push({
              id,
              img,
              link,
              nama,
              star,
              link_download,
            });
          });

        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch {
    console.log("Tidak dapat mengambil data");
  }
});

// Endpoint Apps
router.get("/nineapps/new-apps/:page?", (req, res) => {
  let url = req.params.page
    ? "https://www.9apps.com/id/new-android-apps-" + req.params.page
    : "https://www.9apps.com/id/new-android-apps-1";

  try {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const main = $(".pc-wrap");

        let data = [];
        main
          .find(".pc-android-right > .cate-list-wrap > .cate-list > li")
          .each((id, el) => {
            const img = $(el)
              .find(".category-template-img > a > img")
              .attr("src");
            const link = $(el)
              .find(".category-template-img > a")
              .attr("href")
              .replace("/id/", "");
            const nama = $(el)
              .find(".category-template-title > a")
              .text()
              .trim();
            const star = $(el).find(".stars > .star").text().trim();
            const link_download = $(el)
              .find(".category-template-down > a.btn-download")
              .attr("href")
              .replace("/id/", "");

            data.push({
              id,
              img,
              link,
              nama,
              star,
              link_download,
            });
          });

        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch {
    console.log("Tidak dapat mengambil data");
  }
});
router.get("/nineapps/most-apps/:page?", (req, res) => {
  let url = req.params.page
    ? "https://www.9apps.com/id/android-apps-featured-" + req.params.page
    : "https://www.9apps.com/id/android-apps-featured";

  try {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const main = $(".pc-wrap");

        let data = [];
        main
          .find(".pc-android-right > .cate-list-wrap > .cate-list > li")
          .each((id, el) => {
            const img = $(el)
              .find(".category-template-img > a > img")
              .attr("src");
            const link = $(el)
              .find(".category-template-img > a")
              .attr("href")
              .replace("/id/", "");
            const nama = $(el)
              .find(".category-template-title > a")
              .text()
              .trim();
            const star = $(el).find(".stars > .star").text().trim();
            const link_download = $(el)
              .find(".category-template-down > a.btn-download")
              .attr("href")
              .replace("/id/", "");

            data.push({
              id,
              img,
              link,
              nama,
              star,
              link_download,
            });
          });

        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch {
    console.log("Tidak dapat mengambil data");
  }
});
router.get("/nineapps/top-apps/:page?", (req, res) => {
  let url = req.params.page
    ? "https://www.9apps.com/id/top-android-apps-" + req.params.page
    : "https://www.9apps.com/id/top-android-apps-1";

  try {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const main = $(".pc-wrap");

        let data = [];
        main
          .find(".pc-android-right > .cate-list-wrap > .cate-list > li")
          .each((id, el) => {
            const img = $(el)
              .find(".category-template-img > a > img")
              .attr("src");
            const link = $(el)
              .find(".category-template-img > a")
              .attr("href")
              .replace("/id/", "");
            const nama = $(el)
              .find(".category-template-title > a")
              .text()
              .trim();
            const star = $(el).find(".stars > .star").text().trim();
            const link_download = $(el)
              .find(".category-template-down > a.btn-download")
              .attr("href")
              .replace("/id/", "");

            data.push({
              id,
              img,
              link,
              nama,
              star,
              link_download,
            });
          });

        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch {
    console.log("Tidak dapat mengambil data ada masalah yang tidak diinginkan");
  }
});

module.exports = router;
