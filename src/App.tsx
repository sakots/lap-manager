import { useState, useEffect } from 'react'
import './App.css'

interface PageInput {
  id: number;
  name: string;
  pageCount: number;
  readingChecks: boolean[];
}

const STORAGE_KEY = 'lap-manager-state';

function App() {
  const [pageInputs, setPageInputs] = useState<PageInput[]>(() => {
    // ローカルストレージから状態を読み込む
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('保存された状態の読み込みに失敗しました:', e);
      }
    }
    // デフォルトの状態を返す
    return [{ id: 1, name: '入力1', pageCount: 0, readingChecks: [false] }];
  });

  // 状態が変更されるたびにローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pageInputs));
    } catch (e) {
      console.error('状態の保存に失敗しました:', e);
    }
  }, [pageInputs]);

  const handleCheckboxClick = (inputId: number, index: number) => {
    setPageInputs(pageInputs.map(input => {
      if (input.id === inputId) {
        const newChecks = [...input.readingChecks];
        newChecks[index] = true;
        return { ...input, readingChecks: [...newChecks, false] };
      }
      return input;
    }));
  };

  const handlePageCountChange = (id: number, value: number) => {
    setPageInputs(pageInputs.map(input => 
      input.id === id ? { ...input, pageCount: value } : input
    ));
  };

  const addNewPageInput = () => {
    const newId = Math.max(...pageInputs.map(input => input.id)) + 1;
    setPageInputs([...pageInputs, { 
      id: newId, 
      name: `入力${newId}`, 
      pageCount: 0,
      readingChecks: [false]
    }]);
  };

  const removePageInput = (id: number) => {
    if (pageInputs.length > 1) {
      setPageInputs(pageInputs.filter(input => input.id !== id));
    }
  };

  const resetState = () => {
    if (window.confirm('すべてのデータをリセットしますか？')) {
      localStorage.removeItem(STORAGE_KEY);
      setPageInputs([{ id: 1, name: '入力1', pageCount: 0, readingChecks: [false] }]);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>lap-manager</h1>
        <button onClick={resetState} className="reset-button">
          リセット
        </button>
      </div>
      <div className="content-container">
        {pageInputs.map((input) => (
          <div key={input.id} className="input-section">
            <div className="input-content">
              <div className="page-input">
                <label>
                  ●
                  <input
                    type="number"
                    value={input.pageCount}
                    onChange={(e) => handlePageCountChange(input.id, Number(e.target.value))}
                    min="0"
                  />
                  {pageInputs.length > 1 && (
                    <button
                      onClick={() => removePageInput(input.id)}
                      className="remove-button"
                    >
                      ×
                    </button>
                  )}
                </label>
              </div>
              <div className="reading-checks">
                <div className="checks-container">
                  {input.readingChecks.map((checked, index) => (
                    <div key={index} className="check-item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxClick(input.id, index)}
                        disabled={checked}
                      />
                      {index === input.readingChecks.length - 1 && !checked && (
                        <span>{input.readingChecks.filter(c => c).length + 1}回目</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addNewPageInput} className="add-button">
          ＋ 入力場所を追加
        </button>
      </div>
    </div>
  );
}

export default App
