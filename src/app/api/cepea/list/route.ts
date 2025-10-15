import { formatarDataBrToIso } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const week = searchParams.get("week") || "0";

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Referer: "https://www.cepea.org.br/",
    };

    // Definir datas
    const hoje = new Date();
    const dataInicial = new Date(hoje);
    dataInicial.setDate(dataInicial.getDate() - (parseInt(week) * 7 || 9999));

    const formatarData = (d: Date) =>
      d.toLocaleDateString("pt-BR").replace(/\//g, "%2F");

    // Monta URL para pegar o link do Excel
    const url = `https://www.cepea.org.br/br/consultas-ao-banco-de-dados-do-site.aspx?tabela_id=349-NP&data_inicial=${formatarData(
      dataInicial
    )}&periodicidade=2&data_final=${formatarData(hoje)}`;

    // Busca URL do arquivo Excel
    const response = await axios.get(url, { headers });
    const arquivoUrl = response.data?.arquivo?.replace(/\\/g, "");

    if (!arquivoUrl) {
      return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });
    }

    // Baixa o arquivo Excel em buffer
    const fileResponse = await axios.get(arquivoUrl, {
      responseType: "arraybuffer",
      headers,
    });

    // Lê o arquivo Excel direto do buffer
    const workbook = XLSX.read(fileResponse.data, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Filtra os dados, ignorando as 2 primeiras linhas
    const dadosFiltrados = rawData.slice(2).map((linha: any) => {

      const linhaPrazo = linha["Tilápia | Preços da tilápia - Norte do Paraná"];

      return ({
        prazoInicial: formatarDataBrToIso(linhaPrazo.split(" - ")[0]),
        prazoFinal: formatarDataBrToIso(linhaPrazo.split(" - ")[1]),
        semFormatar: linhaPrazo,
        valor: linha["__EMPTY"],
        regiao: "Norte do Paraná",
      });
    });

    // Retorna os dados como JSON
    return NextResponse.json({ dados: dadosFiltrados });
  } catch (error: any) {
    console.error("❌ Erro:", error.message);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}
