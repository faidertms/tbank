
import React, { createContext, } from "react";
import { Conta, Usuario } from "../../services/bankAPI";
// import { GetServerSideProps } from "next";
// import { getContaDoUsuario, getUsuario } from '../../services/bankAPI';

export interface IUsuarioContext {
    usuario: Usuario,
    conta: Conta
};

interface ProviderProps {
    children: JSX.Element;
    usuario: Usuario;
    conta: Conta
};

export const UsuarioContext = createContext<IUsuarioContext>({} as IUsuarioContext);

export const UsuarioContextProvider = ({ children, conta, usuario }: ProviderProps): JSX.Element => {
    return (
        <UsuarioContext.Provider value={{
            usuario,
            conta,
        }}>
            {children}
        </UsuarioContext.Provider>
    );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const [usuarioResponse, contaResponse] = await Promise.all([getUsuario(), getContaDoUsuario()]);
//     console.log({
//         usuario: usuarioResponse.data,
//         conta: contaResponse.data
//     })
//     return {
//         props: {
//             usuario: usuarioResponse.data,
//             conta: contaResponse.data
//         },
//     }
// }