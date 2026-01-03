from loguru import logger
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from joblib import dump
import numpy as np
import pandas as pd

# import data
pre_split_training_data = pd.read_csv('../data/cs-training.csv', index_col='Unnamed: 0')

# splits data according to initial split
train_idx, val_idx = train_test_split(
    pre_split_training_data.index,
    test_size=0.2,
    random_state=42,
    stratify=pre_split_training_data['SeriousDlqin2yrs']
)

train_df = pre_split_training_data.loc[train_idx]

# Training set binning of age
train_df['age_bin'] = pd.cut(train_df['age'], bins=[20,30,40,50,60,70,80,110], right=False )
train_df['age_bin_mid'] = train_df['age_bin'].apply(lambda x: (x.left + x.right)/2)

# Training set binning Debt Ratio
max_clip = 3
train_df['DebtRatio'] = train_df['DebtRatio'].clip(upper=max_clip)
train_df['DebtRatio_bin'] = pd.cut(train_df['DebtRatio'], bins=[0, 0.25, 0.5, 0.75, 1, 
                                                                1.25, 1.5, 1.75, 2, 
                                                                2.25, 2.5, 2.75, 3.001,
                                                               ], right=False, include_lowest=True)
train_df['DebtRatio_bin_mid'] = train_df['DebtRatio_bin'].apply(lambda x: (x.left + x.right)/2)


# Delinquencies
# 30-60 day, clip at 4 
train_df['NumberOfTime60-89DaysPastDueNotWorse'] = train_df['NumberOfTime60-89DaysPastDueNotWorse'].clip(upper=4)
# 60-90 day, clip at 4 
train_df['NumberOfTime30-59DaysPastDueNotWorse'] = train_df['NumberOfTime30-59DaysPastDueNotWorse'].clip(upper=4)
# 90 day, clip at 4
train_df['NumberOfTimes90DaysLate'] = train_df['NumberOfTimes90DaysLate'].clip(upper=4)

# Revolving Utilization Of Unsecured Lines
train_df['RevolvingUtilizationOfUnsecuredLines'] = train_df['RevolvingUtilizationOfUnsecuredLines'].clip(lower=0, upper=3)
train_df['log_RevolvingUtilizationOfUnsecuredLines'] = np.log1p(train_df['RevolvingUtilizationOfUnsecuredLines'])

# Monthly Income
income_median = train_df['MonthlyIncome'].median()
train_df['MonthlyIncome_imputed'] = train_df['MonthlyIncome'].fillna(income_median)
train_df['MonthlyIncome_imputed'] = train_df['MonthlyIncome_imputed'].clip(lower=0, upper=50000)

# Number Of Open Credit Lines And Loans
train_df['NumberOfOpenCreditLinesAndLoans'] = train_df['NumberOfOpenCreditLinesAndLoans'].clip(lower=0, upper=40)


def train_model():
    FEATURES = [
        'age_bin_mid',
        'DebtRatio_bin_mid',
        'NumberOfTime30-59DaysPastDueNotWorse',
        'NumberOfTime60-89DaysPastDueNotWorse',
        'NumberOfTimes90DaysLate',
        'log_RevolvingUtilizationOfUnsecuredLines',
        'MonthlyIncome_imputed',
        'NumberOfOpenCreditLinesAndLoans'
    ]

    # DFs used for training
    X_model = train_df[FEATURES]
    Y_model = train_df['SeriousDlqin2yrs']

    # initialize the model
    lr_model = LogisticRegression(
        C=1e2, 
        max_iter=2000,
        solver='lbfgs'
        )
    # fit the model
    lr_model.fit(X_model, Y_model)


    logger.info(
        'Training LR on %d samples with %d features',
        X_model.shape[0],
        X_model.shape[1]
    )

    dump(
        {
            'model': lr_model,
            'features': FEATURES,
            'version': 'v1.0'
        },
        'lr_model.joblib'
    )

if __name__ == '__main__':
    logger.debug('Training LR model')
    train_model()
    