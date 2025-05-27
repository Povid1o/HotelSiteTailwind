import React, { memo } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
 
interface CircularPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CircularPagination: React.FC<CircularPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const getItemProps = (index: number) => ({
    variant: currentPage === index ? "filled" : "text",
    color: "gray",
    onClick: () => onPageChange(index),
    className: "rounded-full",
  } as any);
 
  const next = () => {
    if (currentPage === totalPages) return;
    onPageChange(currentPage + 1);
  };
 
  const prev = () => {
    if (currentPage === 1) return;
    onPageChange(currentPage - 1);
  };

  // Создаем массив кнопок страниц
  const renderPageButtons = () => {
    const buttons = [];
    
    // Если страниц меньше или равно 5, показываем все
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <IconButton key={i} {...getItemProps(i)}>{i}</IconButton>
        );
      }
    } else {
      // Если страниц больше 5, показываем текущую, две до и две после (если возможно)
      // Всегда показываем первую и последнюю страницу
      
      // Добавляем первую страницу
      buttons.push(
        <IconButton key={1} {...getItemProps(1)}>1</IconButton>
      );
      
      // Если текущая страница > 3, добавляем многоточие
      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="mx-2">...</span>
        );
      }
      
      // Добавляем страницы вокруг текущей
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) { // Не дублируем первую и последнюю страницу
          buttons.push(
            <IconButton key={i} {...getItemProps(i)}>{i}</IconButton>
          );
        }
      }
      
      // Если текущая страница < totalPages - 2, добавляем многоточие
      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="mx-2">...</span>
        );
      }
      
      // Добавляем последнюю страницу
      buttons.push(
        <IconButton key={totalPages} {...getItemProps(totalPages)}>{totalPages}</IconButton>
      );
    }
    
    return buttons;
  };
 
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <Button
        variant="text"
        className="flex items-center gap-2 rounded-full"
        onClick={prev}
        disabled={currentPage === 1}
      >
        <MdKeyboardArrowLeft strokeWidth={2} className="h-4 w-4" /> Предыдущая
      </Button>
      <div className="flex items-center gap-2">
        {renderPageButtons()}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2 rounded-full"
        onClick={next}
        disabled={currentPage === totalPages}
      >
        Следующая
        <MdKeyboardArrowRight strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default memo(CircularPagination);
