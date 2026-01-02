import { useEffect, useState } from "react";
import { addTodo, deleteTodo, fetchTodos, toggleTodo } from "./services/todoService";
import type { Todo } from "./types/todo";

function App() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // 초기 Loading
  useEffect(() => {
    (
      async () => {
        setLoading(true);
        try{
          const data = await fetchTodos();
          setTodos(data);
        } catch(error){
          console.error("에러가 발생했습니다. ", error);
          alert("データを読んでる間エラーが発生しました。")
        } finally{
          setLoading(false);
        }
      }
    )();    // 즉시 실행 함수 IIFE(Immediately Invoked Function Expression)
  }, []);

  // 완료 체크 토글
  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await toggleTodo(id, completed);
      setTodos((prev) => prev.map(
        (todo) => todo.id === id ? {...todo, completed} : todo
      ));
    } catch(error){
      console.error("업데이트 중 오류 발생", error);
      alert("Update中、エラーが発生しました。")
    }
  }

  // Todo 추가
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("값 들어가는지 확인", newTitle);

    const title = newTitle.trim();  // 공백은 지우기
    if(!title) return;
    setAdding(true);  // 입력하는 중이다

    try{
      await addTodo(title);
      setNewTitle("");
      const data = await fetchTodos();
      setTodos(data);
      console.log("뭐가 들어오냐?", data);

    }catch(error){
      console.error(error);
      alert("追加の途中エラーが発生しました");
    }finally{
      setAdding(false); // 다 끝나면 추가 버튼 원래 상태로 해줘야함
    }

  }

  // 삭제
  const handleDelete = async (id: string) => {
    if(!confirm("本当に削除しますか？"))　return;
    try {
    await deleteTodo(id);
    setTodos(prev => prev.filter((todo) => todo.id !== id));
  } catch(error){
    console.error(error);
    alert("削除中、エラーが発生しました。");
  }
  
  } 

  return (
    <>
      <main className="min-h-screen flex bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-slate-800">Firebase Todo List</h1>
          <form className="flex gap-2 mb-4" onSubmit={handleAddTodo}>
            <input 
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="TODO　LISTを入力してください。"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            <button 
            disabled={adding}  // 값을 넣고 처리되기까지는 비활성화
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
            disabled:opcaity-60 disabled:cursor-not-allowed hover:bg-blue-700 transition">{adding ? 'Adding...' : 'Add'}</button>
          </form>
          {/* 로딩 표시 */}
          {loading && (
            <p className="text-center text-slate-500">Loaing...</p>
          )}
          {/* Todo 목록 */}
          {!loading && todos.length === 0 && (
            <p className="text-center text-slate-400">Todo Listが空いてます。</p>
          )}
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {todos.map((todo) => (
              <li 
                key={todo.id}
              className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <label className="flex items-center gap-2 flex-1">
                  <input type="checkbox" checked={todo.completed} className="w-4 h-4"　onChange={(e) => handleToggle(todo.id, e.target.checked)} />
                  <span 
                    className={`text-sm ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}
                  >{todo.title}
                  </span>
                </label>
                <button
                  onClick={() => {handleDelete(todo.id)}}
                  className="text-xs text-red-500 hober:text-red-600 px-2 py-1 transition">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}

export default App
