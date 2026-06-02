// Máscaras de formulário e consulta de CEP (ViaCEP).
// formatarCpf/Telefone/Cep/Cartao/Validade + buscarCep.

export function somenteDigitos(valor: string): string {
  return (valor || "").replace(/\D/g, "");
}

export function formatarCpf(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 11);
  return digitos
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function formatarTelefone(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 11);
  if (digitos.length <= 2) return digitos.replace(/^(\d{0,2})/, "($1");
  if (digitos.length <= 7) return digitos.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  return digitos.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
}

export function formatarCep(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 8);
  return digitos.replace(/^(\d{5})(\d{0,3}).*/, "$1-$2").replace(/-$/, "");
}

export function formatarCartao(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 16);
  return digitos.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatarValidade(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 4);
  return digitos.replace(/^(\d{2})(\d{0,2})/, "$1/$2").replace(/\/$/, "");
}

export interface EnderecoViaCep {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export async function buscarCep(cep: string): Promise<EnderecoViaCep> {
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!resposta.ok) throw new Error("CEP não encontrado");
  const dados = (await resposta.json()) as EnderecoViaCep;
  if (dados.erro) throw new Error("CEP inválido");
  return dados;
}
