import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"; 

const todosCollection = collection(db, "todos");

export async function addTodo(title: string): Promise<void> {
    // FireStore 저장 부분

    await addDoc(todosCollection, {
        title,
        completed: false,
        createdAt: Date.now()
    });
}