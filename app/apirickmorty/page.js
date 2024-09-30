"use client"; // Adicione esta linha

import { useState, useEffect } from 'react';
import styles from './apirickmort.module.css';

export default function RickAndMortyAPI() {
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [details, setDetails] = useState(null);
  const charactersPerPage = 10;

  const [pageRangeStart, setPageRangeStart] = useState(1); // Primeiro botão do conjunto de páginas
  const pagesPerSet = 5; // Quantidade de botões de página exibidos por vez

  useEffect(() => {
    fetch('https://rickandmortyapi.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          characters(page: ${currentPage}) {
            results {
              id
              name
              species
              gender
              origin {
                name
              }
              status
              image
              episode {
                id
              }
            }
          }
        }`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data.data.characters.results);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [currentPage]);

  const handleDetails = (character) => {
    setDetails(character);
  };

  const closeDetails = () => {
    setDetails(null);
  };

  const totalPages = 42; // Limitar total de páginas a 42

  const handleNextSet = () => {
    if (pageRangeStart + pagesPerSet <= totalPages) {
      setPageRangeStart(pageRangeStart + pagesPerSet);
    }
  };

  const handlePrevSet = () => {
    if (pageRangeStart - pagesPerSet > 0) {
      setPageRangeStart(pageRangeStart - pagesPerSet);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
    setPageRangeStart(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
    setPageRangeStart(totalPages - (totalPages % pagesPerSet || pagesPerSet) + 1);
  };

  return (
    <div className={styles.container}>
      {/* Adicionando a imagem acima do título */}
      <img
        src="rick.png" 
        alt="Rick and Morty"
        className={styles.titleImage}
      />
      <h1 className={styles.title}>Personagens de Rick and Morty</h1>
      <div className={styles.characterList}>
        {characters.map((character) => (
          <div key={character.id} className={styles.pokemonCard}>
            <img className={styles.pokemonImage} src={character.image} alt={character.name} />
            <h2 className={styles.title}>{character.name}</h2>
            <button onClick={() => handleDetails(character)} className={styles.detailsButton}>
              Detalhes
            </button>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className={styles.pagination}>
        {/* Botão "Primeiro" */}
        <button onClick={handleFirstPage} className={styles.pageButton}>
          Primeiro
        </button>

        {/* Botão seta "<" (voltar) */}
        <button
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          {'<'}
        </button>

        {/* Botões de páginas */}
        {Array.from({ length: Math.min(pagesPerSet, totalPages - pageRangeStart + 1) }, (_, index) => (
          <button
            key={pageRangeStart + index}
            onClick={() => handlePageClick(pageRangeStart + index)}
            className={currentPage === pageRangeStart + index ? styles.activePage : styles.pageButton}
          >
            {pageRangeStart + index}
          </button>
        ))}

        {/* Botão seta ">" (avançar) */}
        <button
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          {'>'}
        </button>

        {/* Botão "Último" */}
        <button onClick={handleLastPage} className={styles.pageButton}>
          Último
        </button>
      </div>

      {/* Detalhes do Personagem */}
      {details && (
        <div className={styles.detailsModal}>
          <button onClick={closeDetails} className={styles.closeButton}>Fechar</button>
          <img className={styles.pokemonImage} src={details.image} alt={details.name} />
          <h2>{details.name}</h2>
          <p><strong>Espécie:</strong> {details.species}</p>
          <p><strong>Sexo:</strong> {details.gender}</p>
          <p><strong>Origem:</strong> {details.origin.name}</p>
          <p><strong>Status:</strong> {details.status}</p>
          <p><strong>Última vez visto em:</strong> {details.episode.length} episódio(s)</p>
          <p><strong>Registro criado:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
