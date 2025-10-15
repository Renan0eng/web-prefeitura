import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Função que converte "16/09/2024" em "2024-09-16T00:00:00.000Z"
function parseBrDateToISO(dateStr: string): string {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const registros = body.map((item) => {
      console.log(`Processando item: ${item.prazo}, ${item.valor}, ${item.regiao}`);

      const [inicio, fim] = item.prazo.split(" - ");
      const prazoInicial = parseBrDateToISO(inicio);
      const prazoFinal = parseBrDateToISO(fim);

      console.log(`Inserindo registro: ${item.prazo}, ${prazoInicial}, ${prazoFinal}, ${item.valor}, ${item.regiao}`);

      return {
        prazo: item.prazo,
        prazoInicial,
        prazoFinal,
        valor: parseFloat(item.valor.replace(",", ".")),
        regiao: item.regiao,
      };
    });

    const inserted = await prisma.precoTilapia.createMany({
      data: registros,
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        message: "Dados inseridos com sucesso!",
        count: inserted.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro cepea:", error);
    return NextResponse.json({ error: "Erro cepea" }, { status: 500 });
  }
};
