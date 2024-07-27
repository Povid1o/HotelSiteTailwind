import React from 'react';
import Navbar from './components/Navbar';
import CreateClase from './components/modals/CreateClase';
import CreateType from './components/modals/СreateType';
import ModalsCard from './components/modals/ModalsCard'
import Card from './components/Card';
import CreateProduct from './components/modals/CreateProduct';

const addType = () => {
  return(
      <Card >
          <button
          className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
        >
          Добавить тип
        </button>      
      </Card>

  )
}

const addClase = () => {
    return(
        <Card >
            <button
            className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
          >
            Добавить Класс
          </button>      
        </Card>

    )
}

const addProduct = () => {
    return(
        <Card >
            <button
            className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
          >
            Добавить Продукт
          </button>      
        </Card>

    )
}

function AdminPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-500 bg-no-repeat bg-cover">
      <Navbar />
        <div className="container m-auto  p-4 mt-auto md:p-6 lg:p-12 ">
        <h1 className="text-3xl text-white font-bold mb-4 text-center">Административная панель</h1>
            <div className="flex flex-col space-y-4 pt-4">
            <ModalsCard
                                Card={addType}
                                ExtContent={CreateType}
                            /> 
                <ModalsCard
                                Card={addClase}
                                ExtContent={CreateClase}
                            /> 
                <ModalsCard
                                Card={addProduct}
                                ExtContent={CreateProduct}
                            /> 
            </div>
        </div>
    </div>
  );
}

export default AdminPage;