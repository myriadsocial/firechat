import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Gun from "gun";
import "gun/sea";
import "gun/lib/store";
import "gun/lib/radix";
import "gun/lib/radisk";
import "gun/lib/rindexed";

const gun = Gun({ localstorage: false });

const App = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const inputRef = useRef();

  const handleSubmit = () => {
    const name = inputRef.current.value;
    const randomId = `id_${Date.now()}`;
    const nodeReference = gun
      .get("myAnimals")
      .get(randomId)
      .put({ name, id: randomId });
    gun.get("myAnimalsTextIndex").get(name).get(randomId).put(nodeReference);
    inputRef.current.value = "";
  };

  const handleDelete = (id) => () => {
    // in Gun you delete by setting the node to null
    gun.get("myAnimals").get(id).put(null);
  };

  useEffect(() => {
    gun.get("myAnimals").open((data) => {
      const animals = Object.values(data)
        // filter out deleted values which will appear as null
        .filter((item) => !!item && !!item.name);

      // update local state which will be rendered
      setItems(animals);
    });

    return () => {
      // this is the "unmount" part; we want to stop listening to updates
      // coming on this stream after the component is unmounted
      gun.get("myAnimals").off();
    };
  }, []);

  const handleSearch = (e) => {
    console.log(e.target.value);
    gun
      .get("myAnimalsTextIndex")
      //.get("dog")
      .get({ ".": { "*": e.target.value } })
      .once()
      .map()
      .once(data=>{
        console.log(data);
        const filteredAnimals = Object.values(data)
          // filter out deleted values which will appear as null
          .filter((item) => !!item && !!item.name);

        // update local state which will be rendered
        setFilteredItems(filteredAnimals);
      })
  };

  console.log(JSON.stringify(filteredItems, null, 2));

  return (
    <div>
      <div>
        <input ref={inputRef} />
        <button onClick={handleSubmit}>CREATE ITEM</button>
        <h3>Total items: {items.length}</h3>
        <ul>
          {items.map((animal) => (
            <li key={animal.id}>
              {animal.name}
              <button onClick={handleDelete(animal.id)}>X</button>
            </li>
          ))}
        </ul>
        <div>
          Search: <input onChange={handleSearch} />
          <ul>
            Filtered items:
            {filteredItems.map((animal) => (
              <li key={animal.id}>{animal.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("container"));
