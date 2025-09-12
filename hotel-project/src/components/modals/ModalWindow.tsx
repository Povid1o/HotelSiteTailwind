import './../styles/modalWindow.css'

export default function ModalWindow({ onClose }: { onClose: () => void }) {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1001]">
            <div className="modal-window">
                <h2 className="font-bold mb-4

                modal-window-text">Подтвердите, что вам исполнилось 18 лет</h2>
                <div className={'modal-window-buttons'}>
                    <button
                        className="bg-black text-white mb-10 button-modal-window"
                        onClick={onClose}
                    > Да, мне есть 18
                    </button>
                    <button
                        className=" border-4 border-black button-modal-window"
                        onClick={ () => {window.location.href = 'https://rutube.ru/video/e25c4d73f2d863a6805e92e20c154881/'} }
                    > Нет, мне нет 18
                    </button>
                </div>
            </div>
        </div>
    );
}



