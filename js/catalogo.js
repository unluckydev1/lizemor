(() => {
  // ===== Modelos (cartela) =====
  // Para usar suas imagens reais, troque a lista MODELS por entradas como:
  // {cat:'hk', code:'HK-01', name:'Hello Kitty laço', img:'fotos/hk01.jpg'}
  // "code" é o código que aparece no pedido do WhatsApp. Se "img" começar com http(s), o link da imagem também vai na mensagem.
  const CATS = [
    { id: 'hk', name: 'Hello Kitty', color: '#F6DADA', prefix: 'HK' },
    { id: 'sp', name: 'Homem-Aranha', color: '#F2C9C9', prefix: 'HA' },
    { id: 'gt', name: 'Gato', color: '#FBE9C9', prefix: 'GT' },
    { id: 'ds', name: 'Demon Slayer', color: '#D7E8DA', prefix: 'DS' },
    { id: 'hp', name: 'Harry Potter', color: '#E3DDF0', prefix: 'HP' }
  ];
  // Fotos de cada categoria (na ordem). Para trocar uma foto, substitua o texto dela por um caminho/link, ex.: 'fotos/hk01.jpg'.
  const IMGS = {
    "hk": [
      "assets/broches/hello-kitty-01.webp",
      "assets/broches/hello-kitty-02.webp",
      "assets/broches/hello-kitty-03.webp",
      "assets/broches/hello-kitty-04.webp",
      "assets/broches/hello-kitty-05.webp",
      "assets/broches/hello-kitty-06.webp",
      "assets/broches/hello-kitty-07.webp",
      "assets/broches/hello-kitty-08.webp",
      "assets/broches/hello-kitty-09.webp",
      "assets/broches/hello-kitty-10.webp",
      "assets/broches/hello-kitty-11.webp",
      "assets/broches/hello-kitty-12.webp",
      "assets/broches/hello-kitty-13.webp",
      "assets/broches/hello-kitty-14.webp",
      "assets/broches/hello-kitty-15.webp",
      "assets/broches/hello-kitty-16.webp",
      "assets/broches/hello-kitty-17.webp",
      "assets/broches/hello-kitty-18.webp",
      "assets/broches/hello-kitty-19.webp",
      "assets/broches/hello-kitty-20.webp",
      "assets/broches/hello-kitty-21.webp",
      "assets/broches/hello-kitty-22.webp",
      "assets/broches/hello-kitty-23.webp",
      "assets/broches/hello-kitty-24.webp",
      "assets/broches/hello-kitty-25.webp",
      "assets/broches/hello-kitty-26.webp",
      "assets/broches/hello-kitty-27.webp",
      "assets/broches/hello-kitty-28.webp",
      "assets/broches/hello-kitty-29.webp",
      "assets/broches/hello-kitty-30.webp",
      "assets/broches/hello-kitty-31.webp",
      "assets/broches/hello-kitty-32.webp",
      "assets/broches/hello-kitty-33.webp",
      "assets/broches/hello-kitty-34.webp",
      "assets/broches/hello-kitty-35.webp",
      "assets/broches/hello-kitty-36.webp",
      "assets/broches/hello-kitty-37.webp",
      "assets/broches/hello-kitty-38.webp",
      "assets/broches/hello-kitty-39.webp",
      "assets/broches/hello-kitty-40.webp",
      "assets/broches/hello-kitty-41.webp",
      "assets/broches/hello-kitty-42.webp",
      "assets/broches/hello-kitty-43.webp"
    ],
    "ds": [
      "assets/broches/demon-slayer-01.webp",
      "assets/broches/demon-slayer-02.webp",
      "assets/broches/demon-slayer-03.webp",
      "assets/broches/demon-slayer-04.webp",
      "assets/broches/demon-slayer-05.webp",
      "assets/broches/demon-slayer-06.webp",
      "assets/broches/demon-slayer-07.webp",
      "assets/broches/demon-slayer-08.webp",
      "assets/broches/demon-slayer-09.webp",
      "assets/broches/demon-slayer-10.webp",
      "assets/broches/demon-slayer-11.webp",
      "assets/broches/demon-slayer-12.webp",
      "assets/broches/demon-slayer-13.webp",
      "assets/broches/demon-slayer-14.webp",
      "assets/broches/demon-slayer-15.webp",
      "assets/broches/demon-slayer-16.webp",
      "assets/broches/demon-slayer-17.webp",
      "assets/broches/demon-slayer-18.webp",
      "assets/broches/demon-slayer-19.webp",
      "assets/broches/demon-slayer-20.webp",
      "assets/broches/demon-slayer-21.webp",
      "assets/broches/demon-slayer-22.webp",
      "assets/broches/demon-slayer-23.webp",
      "assets/broches/demon-slayer-24.webp",
      "assets/broches/demon-slayer-25.webp",
      "assets/broches/demon-slayer-26.webp",
      "assets/broches/demon-slayer-27.webp",
      "assets/broches/demon-slayer-28.webp",
      "assets/broches/demon-slayer-29.webp",
      "assets/broches/demon-slayer-30.webp",
      "assets/broches/demon-slayer-31.webp",
      "assets/broches/demon-slayer-32.webp"
    ],
    "sp": [
      "assets/broches/homem-aranha-01.webp",
      "assets/broches/homem-aranha-02.webp",
      "assets/broches/homem-aranha-03.webp",
      "assets/broches/homem-aranha-04.webp",
      "assets/broches/homem-aranha-05.webp",
      "assets/broches/homem-aranha-06.webp",
      "assets/broches/homem-aranha-07.webp",
      "assets/broches/homem-aranha-08.webp",
      "assets/broches/homem-aranha-09.webp",
      "assets/broches/homem-aranha-10.webp",
      "assets/broches/homem-aranha-11.webp",
      "assets/broches/homem-aranha-12.webp",
      "assets/broches/homem-aranha-13.webp",
      "assets/broches/homem-aranha-14.webp",
      "assets/broches/homem-aranha-15.webp",
      "assets/broches/homem-aranha-16.webp",
      "assets/broches/homem-aranha-17.webp",
      "assets/broches/homem-aranha-18.webp",
      "assets/broches/homem-aranha-19.webp",
      "assets/broches/homem-aranha-20.webp",
      "assets/broches/homem-aranha-21.webp",
      "assets/broches/homem-aranha-22.webp",
      "assets/broches/homem-aranha-23.webp",
      "assets/broches/homem-aranha-24.webp",
      "assets/broches/homem-aranha-25.webp",
      "assets/broches/homem-aranha-26.webp"
    ],
    "hp": [
      "assets/broches/harry-potter-01.webp",
      "assets/broches/harry-potter-02.webp",
      "assets/broches/harry-potter-03.webp",
      "assets/broches/harry-potter-04.webp",
      "assets/broches/harry-potter-05.webp",
      "assets/broches/harry-potter-06.webp",
      "assets/broches/harry-potter-07.webp",
      "assets/broches/harry-potter-08.webp",
      "assets/broches/harry-potter-09.webp"
    ],
    "gt": [
      "assets/broches/gato-01.webp",
      "assets/broches/gato-02.webp",
      "assets/broches/gato-03.webp",
      "assets/broches/gato-04.webp",
      "assets/broches/gato-05.webp",
      "assets/broches/gato-06.webp",
      "assets/broches/gato-07.webp",
      "assets/broches/gato-08.webp",
      "assets/broches/gato-09.webp",
      "assets/broches/gato-10.webp",
      "assets/broches/gato-11.webp",
      "assets/broches/gato-12.webp",
      "assets/broches/gato-13.webp",
      "assets/broches/gato-14.webp",
      "assets/broches/gato-15.webp",
      "assets/broches/gato-16.webp"
    ]
  };
  const MODELS = CATS.flatMap(category =>
    IMGS[category.id].map((img, index) => {
      const number = String(index + 1).padStart(2, '0');
      return {
        cat: category.id,
        code: category.prefix + '-' + number,
        name: category.name + ' ' + number,
        img
      };
    })
  );
  const catOf = id => CATS.find(c => c.id === id);
  function thumb(m) {
    if (m.img) return m.img;
    const c = catOf(m.cat);
    const mark = c.name.slice(0, 2).toUpperCase();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' fill='${c.color}'/><circle cx='60' cy='52' r='34' fill='#fffdf9' fill-opacity='.78'/><text x='60' y='62' font-size='26' text-anchor='middle' fill='#4A7A57' font-family='sans-serif' font-weight='bold'>${mark}</text><text x='60' y='100' font-size='14' text-anchor='middle' fill='#D14242' font-family='sans-serif' font-weight='bold'>${m.code}</text></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }
  
  const COR = ['Preto', 'Azul'];
  
  const SUP = {
    label: 'Espessura do celular (com capinha)',
    options: ['Pequeno: até 11,5 mm', 'Grande: de 11,5 a 13 mm']
  };
  
  const P3D = [
    {
      id: 'sapo',
      name: 'Sapo',
      price: 20,
      img: 'assets/3d/impressao-3d-sapo.jpg',
      sq: true,
      desc: 'Sapo articulado impresso em 3D, com patinhas que se mexem.',
      colors: COR
    },
    {
      id: 'dragao',
      name: 'Dragão',
      price: 25,
      img: 'assets/3d/impressao-3d-dragao.jpg',
      sq: true,
      desc: 'Dragão articulado impresso em 3D, com corpo flexível cheio de detalhes.',
      colors: COR
    },
    {
      id: 'bolinha',
      name: 'Bolinha',
      price: 15,
      img: 'assets/3d/impressao-3d-bolinha.jpg',
      desc: 'Bolinha em espiral impressa em 3D, ótima para brincar com as mãos.',
      colors: COR
    },
    {
      id: 'hexagonal',
      name: 'Chaveiro Hexagonal',
      price: 10,
      img: 'assets/3d/chaveiro-hexagonal.jpg',
      desc: 'Chaveiro hexagonal em camadas, com argola e corrente.',
      colors: COR
    },
    {
      id: 'suporte',
      name: 'Suporte de Celular',
      price: 20,
      img: 'assets/3d/suporte-de-celular.jpg',
      desc: 'Suporte dobrável para celular, pequeno e fácil de levar no bolso ou no chaveiro. Meça a espessura do celular com a capinha para escolher o tamanho.',
      colors: COR,
      extra: SUP
    },
    {
      custom: true,
      id: 'nome',
      name: 'Chaveiro com Nome',
      price: 10,
      img: 'assets/3d/chaveiro-com-nome.jpg',
      desc: 'Chaveiro personalizado com o nome que você quiser, em duas cores.',
      nameField: true,
      colors: ['Letra azul, fundo preto','Letra preta, fundo azul','Tudo azul','Tudo preto']
    }
  ];
  
  const keyColorClasses = [
    'key-blue-black',
    'key-black-blue',
    'key-all-blue',
    'key-all-black'
  ];
  
  window.LIZEMOR_CATALOG = Object.freeze({
    CATS,
    MODELS,
    thumb,
    P3D,
    keyColorClasses
  });
  
})();


