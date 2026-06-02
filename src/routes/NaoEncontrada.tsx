import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { EmptyState } from "../components/EmptyState";

export default function NaoEncontrada() {
  useDocumentTitle("Página não encontrada | RELIC");
  return (
    <EmptyState
      titulo="Página não encontrada"
      descricao="O endereço acessado não existe ou foi movido."
      acao={
        <Link to="/" className="button-primary">
          Voltar ao início
        </Link>
      }
    />
  );
}
