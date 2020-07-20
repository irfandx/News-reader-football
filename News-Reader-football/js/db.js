let dbPromised = idb.open("news-reader", 1, function(upgradeDb) {
  let articlesObjectStore = upgradeDb.createObjectStore("articles", {
    keyPath: "ID"
  });
  articlesObjectStore.createIndex("post_title", "post_title", { unique: false });
});

//fungsi untuk menyimpan artikel baru (objek di kirim dari hasil parsing json, metod add untuk simpan artikel)
function saveForLater(article) {
  dbPromised
    .then(function(db) {
      let tx = db.transaction("articles", "readwrite");
      let store = tx.objectStore("articles");
      console.log(article);
      store.add(article.result); //mayerorror
      return tx.complete;
    })
    .then(function() {
      console.log("Artikel berhasil di simpan.");
    });
}
//fungsi getAll() untuk mengambil seluruh data dari Indexed DB
function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        let tx = db.transaction("articles", "readonly");
        let store = tx.objectStore("articles");
        return store.getAll();
      })
      .then(function(articles) {
        resolve(articles);
      });
  });
}
//fungsi getById untuk mengambil satu data dari database berdasarkan id
function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        let tx = db.transaction("articles", "readonly");
        let store = tx.objectStore("articles");
        return store.get(id);
      })
      .then(function(article) {
        resolve(article);
      });
  });
}
