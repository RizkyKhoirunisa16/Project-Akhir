const apiKey = 'a8dbb90e45854a5fbeffcd3d77b437a5';

const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const recipesContainer = document.getElementById('recipes');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) return;

  recipesContainer.innerHTML = '<p>Memuat resep...</p>';

  try {
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=12&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    recipesContainer.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      recipesContainer.innerHTML = '<p>Tidak ditemukan resep dengan bahan tersebut.</p>';
      return;
    }

    data.forEach(recipe => {
      const col = document.createElement('div');
      col.className = 'col-md-3';

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

      recipesContainer.appendChild(col);
    });
  } catch (err) {
    recipesContainer.innerHTML = '<p class="text-danger">Gagal memuat resep. Coba lagi nanti.</p>';
    console.error(err);
  }
});
