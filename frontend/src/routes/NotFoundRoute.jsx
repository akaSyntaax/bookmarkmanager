import {Link, Typography} from '@mui/material';

export default function NotFoundRoute() {
    return (
        <>
            <Typography component="h1" variant="h1">404</Typography>
            <Typography component="h1" variant="h4">The requested resource could not be found.</Typography>
            <Typography component="h1" variant="h5">
                If this happened unexpectedly, please file an issue on <Link href="https://github.com/akasyntaax/bookmarkmanager/issues" target="_blank">GitHub</Link>
            </Typography>
        </>
    );
}
