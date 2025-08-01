import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import ContextoUsuario from "../contextos/contexto-usuario";
import formatarPerfil from "../utilitarios/formatar-perfil";
import {
    estilizarBotao, estilizarColuna, estilizarGridColunaSidebar, estilizarGridSidebar,
    estilizarMenu, estilizarMenuLateralDesktop, estilizarMenuLateralMobile, estilizarSidebar,
    estilizarSubtitulo, estilizarTitulo
} from "../utilitarios/estilos";
export default function MenuLateral({ children }) {
    const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuario);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [visible, setVisible] = useState(false);
    const tamanhoDesktop = windowWidth > 991;
    const navegar = useNavigate();
    const opcoesProdutor = [
        { label: "Página Inicial", command: () => navegar("/pagina-inicial") },
        {
            label: "Menu", items: [
                {
                    label: "Cadastrar Usuario", command: () => navegar("/atualizar-usuario"),
                    disabled: usuarioLogado.status !== "ativo"
                },
                { label: "Cadastrar Produtor", command: () => navegar("/cadastrar-produtor") },
                { label: "Administrar Show", command: () => navegar("/administrar-shows") },
                { label: "Sair do Sistema", command: () => sairSistema() },
            ]
        },
    ];
    const opcoesPatrocinador = [
        { label: "Página Inicial", command: () => navegar("/pagina-inicial") },
        {
            label: "Menu", items: [
                {
                    label: "Cadastrar Usuário", command: () => navegar("/atualizar-usuario"),
                    disabled: usuarioLogado.status !== "ativo"
                },
                { label: "Cadastrar Patrocinador", command: () => navegar("/cadastrar-patrocinador") },
                { label: "Administrar Prioridades", command: () => navegar("/administrar-prioridades") },
                { label: "Sair do Sistema", command: () => sairSistema() },
            ]
        },
    ];
    function opcoesMenu() {
        switch (usuarioLogado.perfil) {
            case "produtor": return opcoesProdutor;
            case "patrocinador": return opcoesPatrocinador;
            default: return;
        }
    };
    function sairSistema() {
        setUsuarioLogado(null); 
        navegar("/"); 
    }    
    function redimensionarJanela() {
        setWindowWidth(window.innerWidth);
    };
    function MenuServicos() {
        if (tamanhoDesktop) {
            return (
                <div className={estilizarMenuLateralDesktop(usuarioLogado?.cor_tema)}>
                    <h1 className={estilizarTitulo(usuarioLogado?.cor_tema)}>{usuarioLogado?.nome}</h1>
                    <h2 className={estilizarSubtitulo(usuarioLogado?.cor_tema)}>
                        {formatarPerfil(usuarioLogado?.perfil)}</h2>
                    <Menu className={estilizarMenu()} model={opcoesMenu()} />
                </div>
            );
        } else return (
            <>
                <div className={estilizarMenuLateralMobile(usuarioLogado?.cor_tema)}>
                    <Button className={estilizarBotao(usuarioLogado?.cor_tema)} icon="pi pi-bars"
                        aria-label="Filter" onClick={() => setVisible(true)} />
                    <h1 className={estilizarTitulo(usuarioLogado?.cor_tema)}>{usuarioLogado?.nome}</h1>
                    <h2 className={estilizarSubtitulo(usuarioLogado?.cor_tema)}>
                        {formatarPerfil(usuarioLogado?.perfil)}</h2>
                </div>
                <Sidebar className={estilizarSidebar()} visible={visible}
                    onHide={() => setVisible(false)} showCloseIcon>
                    <Menu className={estilizarMenu()} model={opcoesMenu()} />
                </Sidebar>
            </>
        );
    };
    useEffect(() => {
        window.addEventListener('resize', redimensionarJanela);
        return () => window.removeEventListener('resize', redimensionarJanela);
    }, []);
    return (
        <div className={estilizarGridSidebar(usuarioLogado?.cor_tema)}>
            <div className={estilizarGridColunaSidebar()}><MenuServicos /></div>
            <div className={estilizarColuna()}>{children}</div>
        </div>
    );
}