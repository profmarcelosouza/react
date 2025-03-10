
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTray } from "../../Context/TrayContext"
import { useTrayItems } from "../../Context/TrayItemsContext";
import { TrayItemsTypes } from "../../Types/Contexts/TrayItemsTypes";
import { formatPrice } from "../../utils/formatPrice";
import { AddressWidgetComponent } from "../Addresses/AddressWidgetComponent";
import { Loading } from "../Loading";
import styles from './aside.module.scss';

export const Aside = () => {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const { setOpen } = useTray();

    const [trayBurger, setTrayBurger] = useState([{}]);

    const { address, total, trayItems, removeBurger } = useTrayItems();

    useEffect(() => {

        setTrayBurger(trayItems)

    }, [trayItems])

    const createOrder = async () => {

        setLoading(true)

        const dataToOrder = {
            order: trayBurger,
            address
        }

        await axios.post(`/api/carte`, {
            data: JSON.stringify(dataToOrder)
        })
            .then((data) => {
                router.push("/payment")
            })
            .catch((e: any) => {
                setLoading(false)
            })

    }


    return (
        <aside id="aside">
            <header onClick={() => setOpen(true)}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50.6667 8H13.3067C10.3467 8 8.02667 10.3733 8.02667 13.3333L8 50.6667C8 53.6 10.3467 56 13.3067 56H50.6667C53.6 56 56 53.6 56 50.6667V13.3333C56 10.3733 53.6 8 50.6667 8ZM50.6667 40H40C40 44.4267 36.4 48 32 48C27.6 48 24 44.4267 24 40H13.3067V13.3333H50.6667V40Z" fill="#070D0D" />
                </svg>
                <strong>Bandeja<small></small></strong>
            </header>
            <section>
                <div id="alert"></div>

                <AddressWidgetComponent />

                <ul>
                    {trayItems && trayBurger?.map((item: any, index: number) => (

                        <li key={index} data-key={item.id} className={item.burger?.name ? '' : styles.hide}>
                            <div className={styles.burger}>
                                <div>{item.burger?.name}</div>
                                <div>{formatPrice(parseFloat(item.subTotal))}</div>
                                <button type="button" id="{item.trayID}" aria-label="Remover Hamburguer" onClick={removeBurger}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="black" />
                                    </svg>
                                </button>
                            </div>
                            <div className={styles.aditionals}>
                                <ul>
                                    <li><strong>Lanche</strong>{formatPrice(item.burger?.price)}</li>
                                    {item.aditional?.map((aditionals: TrayItemsTypes) => (
                                        <li key={aditionals.id}>
                                            <span>{aditionals.name}</span>
                                            <span>{formatPrice(parseFloat(aditionals.price))}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}

                </ul>
            </section>
            <footer>

                <div className="close" onClick={() => setOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z" fill="black" />
                    </svg>
                    <span>Esconder Bandeja</span>
                </div>

                <div className="price"><small>Subtotal</small>{formatPrice(total)}</div>

                {loading?
                    <div className={styles.loadingtray}>
                        <Loading />
                    </div>
                    :
                    trayBurger.length >= 1 && address !== 0 ? <button type="button" aria-label="Pagar" onClick={createOrder}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 2H7C5.9 2 5 2.9 5 4V6C5 7.1 5.9 8 7 8H17C18.1 8 19 7.1 19 6V4C19 2.9 18.1 2 17 2ZM17 6H7V4H17V6ZM20 22H4C2.9 22 2 21.1 2 20V19H22V20C22 21.1 21.1 22 20 22ZM18.53 10.19C18.21 9.47 17.49 9 16.7 9H7.3C6.51 9 5.79 9.47 5.47 10.19L2 18H22L18.53 10.19ZM9.5 16H8.5C8.22 16 8 15.78 8 15.5C8 15.22 8.22 15 8.5 15H9.5C9.78 15 10 15.22 10 15.5C10 15.78 9.78 16 9.5 16ZM9.5 14H8.5C8.22 14 8 13.78 8 13.5C8 13.22 8.22 13 8.5 13H9.5C9.78 13 10 13.22 10 13.5C10 13.78 9.78 14 9.5 14ZM9.5 12H8.5C8.22 12 8 11.78 8 11.5C8 11.22 8.22 11 8.5 11H9.5C9.78 11 10 11.22 10 11.5C10 11.78 9.78 12 9.5 12ZM12.5 16H11.5C11.22 16 11 15.78 11 15.5C11 15.22 11.22 15 11.5 15H12.5C12.78 15 13 15.22 13 15.5C13 15.78 12.78 16 12.5 16ZM12.5 14H11.5C11.22 14 11 13.78 11 13.5C11 13.22 11.22 13 11.5 13H12.5C12.78 13 13 13.22 13 13.5C13 13.78 12.78 14 12.5 14ZM12.5 12H11.5C11.22 12 11 11.78 11 11.5C11 11.22 11.22 11 11.5 11H12.5C12.78 11 13 11.22 13 11.5C13 11.78 12.78 12 12.5 12ZM15.5 16H14.5C14.22 16 14 15.78 14 15.5C14 15.22 14.22 15 14.5 15H15.5C15.78 15 16 15.22 16 15.5C16 15.78 15.78 16 15.5 16ZM15.5 14H14.5C14.22 14 14 13.78 14 13.5C14 13.22 14.22 13 14.5 13H15.5C15.78 13 16 13.22 16 13.5C16 13.78 15.78 14 15.5 14ZM15.5 12H14.5C14.22 12 14 11.78 14 11.5C14 11.22 14.22 11 14.5 11H15.5C15.78 11 16 11.22 16 11.5C16 11.78 15.78 12 15.5 12Z" fill="white" />
                    </svg>
                    Pagar
                </button>
                :
                <button type="button" disabled>Escolha o endereço e seus lanches</button>
                }

            
            </footer>
        </aside>
    )
}
