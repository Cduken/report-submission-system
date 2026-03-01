import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Grid, List } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    setIsList: Dispatch<SetStateAction<boolean>>;
    isList: boolean;
}

export default function ToggleGridList({ isList, setIsList }: Props) {
    return (
        <Tooltip >
            <TooltipTrigger asChild>
                <Button
                    onClick={() => {
                        setIsList((prev) => !prev);
                    }}
                    variant={'outline'}
                >
                    {isList ? <List /> : <Grid />}
                </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">
                <p>{isList ? 'Switch to grid view' : 'Switch to list view'}</p>
            </TooltipContent>
        </Tooltip>
    );
}
