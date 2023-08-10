import { MenuButton } from "@chakra-ui/react";

export function MenuButtonSong ({ choosable, children }: { choosable: boolean, children: React.ReactNode }) {
    if (choosable) {
        return (
            <MenuButton>
                {children}
            </MenuButton>
        )
    }
    return children
}