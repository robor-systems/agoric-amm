import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import Toolbar from '@material-ui/core/Toolbar';
import TuneIcon from '@material-ui/icons/Tune';

import { Grid, Container } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import NatPurseAmountInput from './NatPurseAmountInput';
import ConfirmCloseDialog from './ConfirmCloseDialog';
import CloseVault from './CloseVault';

import { makeCloseVaultOffer } from './makeCloseVaultOffer';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    margin: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  settingsToolbar: {
    minHeight: '48px',
    paddingLeft: '20px',
  },
  toolbarIcon: {
    marginRight: theme.spacing(1),
  },
  buttons: {
    marginTop: theme.spacing(3),
  },
  button: {
    color: 'white',
  },
  infoText: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
}));

const AdjustVaultForm = ({ purses, walletP, vaultToManageId }) => {
  const offerBeingMade = false;

  const [collateralPurseSelected, setCollateralPurseSelected] = useState(null);
  const [moePurseSelected, setMoePurseSelected] = useState(null);
  const [collateralValue, setCollateralValue] = useState(0n);
  const [moeValue, setMoeValue] = useState(0n);

  const [needToAddOfferToWallet, setNeedToAddOfferToWallet] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const classes = useStyles();

  // TODO: add form to pay back Moe and want collateral

  useEffect(() => {
    if (needToAddOfferToWallet) {
      makeCloseVaultOffer({
        vaultToManageId,
        walletP,
        moePurseSelected,
        moeValue,
        collateralPurseSelected,
        collateralValue,
      });
      setRedirect('/treasury');
    }
    setNeedToAddOfferToWallet(false);
  }, [needToAddOfferToWallet]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmission = wantToCloseVault => {
    setDialogOpen(false);
    // TODO: check that the purses and amounts are present

    // make offer to the wallet, the react way
    setNeedToAddOfferToWallet(wantToCloseVault);
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div>
      <ConfirmCloseDialog onClose={handleSubmission} open={dialogOpen} />
      <Paper elevation={3}>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar className={classes.settingsToolbar}>
              <TuneIcon className={classes.toolbarIcon} />
              <Typography variant="h6">Close Vault</Typography>
            </Toolbar>
          </AppBar>
        </div>
        <Container maxWidth="sm" className={classes.content}>
          <div className={classes.root}>
            <Grid container>
              <Typography className={classes.infoText}>
                All debt must be paid.
              </Typography>
              {/** TODO: set debt amount to current debt */}
              <NatPurseAmountInput
                offerBeingMade={offerBeingMade}
                purses={purses}
                purseSelected={moePurseSelected}
                amountValue={moeValue}
                onPurseChange={setMoePurseSelected}
                onAmountChange={setMoeValue}
              />
              <Typography className={classes.infoText}>
                How much collateral would you like?
              </Typography>
              <NatPurseAmountInput
                offerBeingMade={offerBeingMade}
                purses={purses}
                purseSelected={collateralPurseSelected}
                amountValue={collateralValue}
                onPurseChange={setCollateralPurseSelected}
                onAmountChange={setCollateralValue}
              />
            </Grid>
          </div>
          <Grid container spacing={1} className={classes.buttons}>
            <Grid item>
              <CloseVault onClick={() => setDialogOpen(true)} />
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </div>
  );
};

export default AdjustVaultForm;