// API Key pribadi dari Spoonacular untuk mengakses layanan resep
const apiKey = 'a8dbb90e45854a5fbeffcd3d77b437a5';

// Mendapatkan elemen-elemen DOM dari form pencarian, input, dan container hasil resep
const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const recipesContainer = document.getElementById('recipes');

// Menambahkan event listener saat form disubmit
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Mencegah reload halaman default saat form disubmit

  const query = input.value.trim(); // Mengambil dan membersihkan input dari pengguna
  if (!query) return; // Jika input kosong, tidak melakukan apa-apa

  // Menampilkan pesan loading di container resep
  recipesContainer.innerHTML = '<p>Memuat resep...</p>';

  try {
    // URL API Spoonacular dengan query bahan makanan dari user
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=12&apiKey=${apiKey}`;
    
    // Fetch data dari API secara asynchronous
    const response = await fetch(url);
    const data = await response.json(); // Parsing hasil ke format JSON

    // Kosongkan kontainer sebelum menampilkan hasil baru
    recipesContainer.innerHTML = '';

    // Jika tidak ada hasil resep yang ditemukan
    if (!Array.isArray(data) || data.length === 0) {
      recipesContainer.innerHTML = '<p>Tidak ditemukan resep dengan bahan tersebut.</p>';
      return;
    }

    // Iterasi setiap resep yang ditemukan dan ditampilkan ke dalam HTML
    data.forEach(recipe => {
      const col = document.createElement('div');
      col.className = 'col-md-3'; // Menggunakan kelas Bootstrap untuk grid 4 kolom

      // Template untuk kartu resep yang berisi gambar, judul, dan link ke detail
      col.innerHTML = `
        <div class="card h-100 shadow-sm text-dark">
          <img src="${recipe.image}" alt="${recipe.title}" class="card-img-top" loading="lazy" />
          <div class="card-body">
            <h5 class="card-title">${recipe.title}</h5>
            <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}" 
               target="_blank" class="btn btn-sm btn-primary">Lihat Detail</a>
          </div>
        </div>
      `;

      // Menambahkan elemen kartu ke dalam container resep
      recipesContainer.appendChild(col);
    });

  } catch (err) {
    // Jika terjadi error saat fetch, tampilkan pesan gagal
    recipesContainer.innerHTML = '<p class="text-danger">Gagal memuat resep. Coba lagi nanti.</p>';
    console.error(err); // Logging error ke konsol untuk debugging
  }
});
