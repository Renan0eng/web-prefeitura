"use client"

import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { NivelAcesso } from "@/types/access-level"
import { NivelAcessoDialog } from "./nivel-acesso-dialog"

interface NivelAcessoComboboxProps {
    niveisDisponiveis: NivelAcesso[]
    value: number[] // Array de IDs selecionados
    onChange: (value: number[]) => void
    onNivelCriado: () => void // Callback para recarregar a lista de níveis
}

export function NivelAcessoCombobox({
    niveisDisponiveis,
    value,
    onChange,
    onNivelCriado,
}: NivelAcessoComboboxProps) {

    const [open, setOpen] = React.useState(false)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

    const selectedNiveis = niveisDisponiveis.filter(n => value.includes(n.idNivelAcesso))

    const handleSelect = (nivelId: number) => {
        const newValue = [...value]
        const index = newValue.indexOf(nivelId)
        if (index > -1) {
            newValue.splice(index, 1) // Remove
        } else {
            newValue.push(nivelId) // Adiciona
        }
        onChange(newValue)
    }

    const handleUnselect = (e: React.MouseEvent, nivelId: number) => {
        e.stopPropagation() // Impede que o Popover abra/feche
        onChange(value.filter(id => id !== nivelId))
    }

    // Callback para quando o diálogo de criação for salvo
    const handleNivelCriado = () => {
        onNivelCriado() // Avisa o componente pai para recarregar a lista de níveis
        setIsCreateDialogOpen(false) // Fecha o diálogo de criação
    }

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div
                        className="w-full border border-input rounded-md min-h-10 p-2 flex flex-wrap gap-1 items-center justify-between cursor-pointer"
                    >
                        <div className="flex flex-wrap gap-1">
                            {selectedNiveis.length === 0 && (
                                <span className="text-muted-foreground px-2">Selecione os níveis...</span>
                            )}
                            {selectedNiveis.map(nivel => (
                                <Badge
                                    key={nivel.idNivelAcesso}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {nivel.nome}
                                    <button
                                        onClick={(e) => handleUnselect(e, nivel.idNivelAcesso)}
                                        className="rounded-full hover:bg-muted-foreground/30"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar nível..." />
                        <CommandList>
                            <CommandEmpty>Nenhum nível encontrado.</CommandEmpty>
                            <CommandGroup>
                                {niveisDisponiveis.map((nivel) => {
                                    const isSelected = value.includes(nivel.idNivelAcesso)
                                    return (
                                        <CommandItem
                                            key={nivel.idNivelAcesso}
                                            value={nivel.nome}
                                            onSelect={() => handleSelect(nivel.idNivelAcesso)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {nivel.nome}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                            {/* Botão de Criação (seu requisito) */}
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        setOpen(false) // Fecha o popover
                                        setIsCreateDialogOpen(true) // Abre o diálogo
                                    }}
                                    className="text-white cursor-pointer"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Criar novo nível de acesso
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* O Diálogo de Criação de Nível */}
            <NivelAcessoDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onNivelCriado={handleNivelCriado}
            />
        </>
    )
}