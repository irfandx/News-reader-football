// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function() {
        console.log("Pendaftaran ServiceWorker artikel berhasil");
      })
      .catch(function() {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });
} else {
  console.log("ServiceWorker belum didukung browser ini.");
}

//DITAMBAHKAN UNTUK NoTIFIKASI
// Periksa fitur Notification API
if ("Notification" in window) {
  requestPermission();
} else {
  console.error("Browser tidak mendukung notifikasi.");
}

// Meminta ijin menggunakan Notification API
function requestPermission() {
  Notification.requestPermission()
  .then(function (result) {
    if (result === "denied") {
      console.log("Fitur notifikasi tidak diijinkan.");
      return;
    } else if (result === "default") {
      console.error("Pengguna menutup kotak dialog permintaan ijin.");
      return;
    }

    console.log("Fitur notifikasi diijinkan.");
  });
}

function showNotifikasiAction() {
    const title = 'Artikel Tersimpan';
    const options = {
        'body': 'Buka Tab Saved atau klik ya',
        'actions': [
          {
            'action' : 'yes-action',
            'title' : 'Ya',
            'icon': '/img/yes.png'
          },
          {
            'action' : 'no-action',
            'title' : 'Tidak',
            'icon': '/img/yes.png'
          }
        ]

    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('FItur notifikasi tidak diijinkan.');
    }
}

// AKHIR FUNGSI NOTIFIKASI

document.addEventListener("DOMContentLoaded", function() {
  let urlParams = new URLSearchParams(window.location.search);
  let isFromSaved = urlParams.get("saved");
  let btnSave = document.getElementById("save");
  if (isFromSaved) {
    // Hide fab jika dimuat dari indexed db
    btnSave.style.display = 'none';

    // ambil artikel lalu tampilkan
    getSavedArticleById();
  } else {
    const item = getArticleById();
  }

  const item = getArticleById();
  btnSave.onclick = function() {
    btnSave.style.display = "none"; // tombol hilang setelah di klik dan muculkan notifikasi push
    showNotifikasiAction();
    console.log("Tombol FAB di klik.");
    item.then(function(article) {
      saveForLater(article);
    });
  };
});
