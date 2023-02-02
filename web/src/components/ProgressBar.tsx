interface ProgressBarProps {
    progress: number
}

export const ProgressBar = (props: ProgressBarProps) => {
    const progressStyles = {
        width: `${props.progress}%`
    }
    
    return (
        <div className='h-3 rounded-xl bg-zinc-700 w-full mt-4'>
            <div 
                className='h-3 rounded-xl bg-violet-600 w-3/4 transition-all'
                role="progressbar"
                aria-valuenow={props.progress} 
                aria-label="Progresso de hábitos completados nesse dia"
                style={progressStyles}
            />
        </div>
    )
}