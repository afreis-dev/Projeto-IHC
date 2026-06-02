import type { ReactNode } from "react";

interface Props {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
}

export function EmptyState({ titulo, descricao, acao }: Props) {
  return (
    <div className="empty-state">
      <div>
        <h3>{titulo}</h3>
        <p>{descricao}</p>
        {acao}
      </div>
    </div>
  );
}
