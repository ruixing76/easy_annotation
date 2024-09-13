import pandas as pd

# input should contain columns id, text1, text2,..., gt

def prepare_binary_annotation(dataframe):
    def format_instruction(row):
        return f'You will see two questions. Please choose the one you believe is the human answer.\nQuestion: {row["question"]}\n\nA: {row["text1"]}\n\nB: {row["text2"]}'

    dataframe['anno_text'] = dataframe.apply(
        format_instruction , axis=1)
    return dataframe

# Example usage with your DataFrame
# Assuming 'df' is your DataFrame
if __name__ == '__main__':
    for filename in ['sample_data']:
        df = pd.read_csv(f'./raw_data/{filename}.csv')  # adjust the location accordingly
        df = prepare_binary_annotation(df)
        df.to_csv(f'./data/{filename}_anno.csv',index=False, header=True)  # adjust the location accordingly