import { addDoc, collection, orderBy, getDocs, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import type { Todo } from "../types/todo";

const todosCollection = collection(db, "todos");

// 모든 Todo 가져오기
export async function fetchTodos(): Promise<Todo[]> {
    const q = query(todosCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => (
        {
            id: d.id,
            ...(d.data() as Omit<Todo, "id">)
        }
    ))
}

export async function addTodo(title: string): Promise<void> {
    // FireStore 저장 부분

    await addDoc(todosCollection, {
        title,
        completed: false,
        createdAt: Date.now()
    });
}

// 완료 상태 코드
export async function toggleTodo(id: string, completed: boolean){
    const ref = doc(db, "todos", id);
    await updateDoc(ref, {completed});
}

// 삭제 코드
export async function deleteTodo(id: string){
    const ref = doc(db, "todos", id);
    await deleteDoc(ref);
}