import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

function Dashboard({ token, onLogout, loggedInUserId }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filterOption, setFilterOption] = useState('others'); 

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    let currentFiltered = topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(lowerSearch) ||
        (topic.keywords &&
          topic.keywords.some((kw) => kw.toLowerCase().includes(lowerSearch)))
    );

    if (filterOption === 'mine') {
      currentFiltered = currentFiltered.filter(
        (topic) => topic.user_id === parseInt(loggedInUserId)
      );
    } else if (filterOption === 'others') {
      currentFiltered = currentFiltered.filter(
        (topic) => topic.user_id !== parseInt(loggedInUserId)
      );
    }

    setFilteredTopics(currentFiltered);
  }, [searchTerm, topics, filterOption, loggedInUserId]);

  async function fetchTopics() {
    setLoading(true);
    try {
      const res = await axios.get("/topics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopics(res.data);
    } catch (error) {
      console.error("Erro ao buscar tópicos:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchClick() {
    document.getElementById("search-input").focus();
  }

  const handleToggleFilter = () => {
    setFilterOption(prev => {
      if (prev === 'mine') {
        return 'others'; 
      } else {
        return 'mine'; 
      }
    });
  };

  const getFilterButtonText = () => {
    if (filterOption === 'mine') {
      return 'Ver Tópicos de Outros'; 
    } else { 
      return 'Ver Meus Tópicos'; 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
      <div className="w-full max-w-4xl mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Base de Conhecimentos Tech</h1>
          <p className="mt-2 text-gray-600">Explore tópicos relevantes para tecnologia</p>
        </div>
      </div>

      <div className="fixed top-6 right-6 flex space-x-4">
        {loggedInUserId && ( 
          <button
            onClick={handleToggleFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
            title={getFilterButtonText()}
          >
            {getFilterButtonText()}
          </button>
        )}
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow"
          title="Sair"
        >
          Sair
        </button>
      </div>

      <div className="w-full max-w-4xl mb-2 relative">
        <input
          id="search-input"
          type="text"
          placeholder="Buscar tópicos por título ou palavra-chave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearchClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
          aria-label="Buscar"
        >
          <FaSearch size={18} />
        </button>
      </div>

      <button
        onClick={() => window.location.assign("/topics/new")}
        className="mb-6 w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition"
      >
        Criar Novo Tópico
      </button>

      {loading ? (
        <div className="text-gray-500 text-center mt-10">Carregando tópicos...</div>
      ) : filteredTopics.length === 0 && searchTerm === "" ? ( 
        filterOption === 'mine' ? (
          <div className="flex flex-col items-center justify-center mt-20 space-y-4 text-center text-gray-500">
            <span className="text-6xl select-none">👀</span>
            <h2 className="text-xl font-semibold">Você ainda não criou nenhum tópico.</h2>
            <p className="max-w-md text-gray-400">
              Clique em "Criar Novo Tópico" para começar!
            </p>
          </div>
        ) : ( // filterOption === 'others'
          <div className="flex flex-col items-center justify-center mt-20 space-y-4 text-center text-gray-500">
            <span className="text-6xl select-none">🌍</span>
            <h2 className="text-xl font-semibold">Nenhum tópico criado por outros usuários.</h2>
            <p className="max-w-md text-gray-400">
              No momento, não há tópicos de outros usuários para exibir.
            </p>
          </div>
        )
      ) : filteredTopics.length === 0 && searchTerm !== "" ? ( 
        <div className="flex flex-col items-center justify-center mt-20 space-y-4 text-center text-gray-500">
          <span className="text-6xl select-none">🔍</span>
          <h2 className="text-xl font-semibold">Nenhum tópico encontrado com sua busca.</h2>
          <p className="max-w-md text-gray-400">
            Ajuste seus termos de busca e tente novamente.
          </p>
        </div>
      ) : ( 
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition cursor-pointer"
              onClick={() => window.location.assign(`/topics/${topic.id}`)}
              title="Clique para ver detalhes"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{topic.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{topic.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {topic.keywords &&
                  topic.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded"
                    >
                      {kw}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;