import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Todo from './Todo';
import { db } from './firebase';
import { addDoc, collection } from 'firebase/firestore';


import {
  query,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';


function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === '') {
      alert('Lütfen geçerli bir görev giriniz');
      return;
    }
    await addDoc(collection(db, 'todos'), {
      text: input,
      completed: false,
    });
    setInput('');
  };

  // Read todo from firebase
  useEffect(() => {
    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);
  
  // Update todo in firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    });
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };
  return (

    <div className="sayfaMain row" style={{ height: '100vh' }}>
    <div className="solMenu col-2" style={{ backgroundColor: '#2c3e50',paddingRight:'0' }}>

      <div className='solIcon' style={{padding:'20px',color:'#8F43AF',textAlign:'center',fontWeight:600,fontSize:'20px',paddingTop:'58px',display:'flex',justifyContent:'center'}}>

          <img src='https://svgur.com/i/sAk.svg' style={{transform:'scale(0.7)'}}/>
          <title>SDFNSKDF</title>
      </div>
    </div>
    <div
      className="sagMenu col-10"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
        padding: 0,
      }}
    >
      <div
        className="sagUst"
        style={{ flex: 1, backgroundColor: '#2c3e50', width: '100%',display:'flex',alignItems:'end' }}
      >

      <div style={{color:'white',padding:'15px',marginBottom:'10px',fontSize:'18px',width:'100%',textAlign:'center'}}>
        Yapılacaklar Listesi ( {todos.length < 1 ? 'Hiç Görev Yok' : (`Toplam ${todos.length} Görev`)})
      </div>

      </div>

      <div
        className="sagIcerik row"
        style={{ flex: 10, width: '100%', backgroundColor: 'white',margin: '0' }}
      >
        <div
          className="divYapilacaklar col-6"
          style={{ backgroundColor: 'white',maxHeight:'82vh',overflow:'scroll' }}
        >

          <div style={{width:'100%',height:'30px',textAlign:'center',marginTop:'15px'}}>Henüz Tamamlanmamış Görevler</div>

          <ul className="list-group">
            {todos.map((todo, index) => (
              <Todo
                key={index}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
                completedList={false}
              />
            ))}
          </ul>
          

        </div>
        <div
          className="divTamamlananlar col-6"
          style={{ backgroundColor: 'white',borderLeft: '5px solid #2c3e50',maxHeight:'82vh',overflow:'scroll',paddingRight:'24px' }}
        >

        <div style={{width:'100%',height:'30px',textAlign:'center',marginTop:'15px'}}>Tamamlanmış Görevler</div>

          <ul className="list-group">
            {todos.map((todo, index) => (
              <Todo
                key={index}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
                completedList={true}
              />
            ))}
          </ul>

        </div>
      </div>
      <div
        className="sagEkle"
        style={{ flex: 1, width: '100%', backgroundColor: 'white',display:'flex',alignItems:'end',borderTop:'5px solid #2c3e50',padding:'5px 20px' }}
      >

            <div className='col-7'>
            <form onSubmit={createTodo}>
                        <div className="input-group mb-3">
                          <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="form-control"
                            type="text"
                            placeholder="Yeni Görev Ekle"
                            aria-label="Yeni Görev Ekle"
                            aria-describedby="add-button"
                          />
                          <button className="btn" type="submit" id="add-button" style={{border:'1px solid black'}}>
                            <AiOutlinePlus size={30} style={{fill:'black'}} />
                          </button>
                        </div>
                      </form>
            </div>


      </div>
    </div>
  </div>





    
  );
}

export default App;