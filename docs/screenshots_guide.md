# How to Add Screenshots

To make your repository look professional for recruiters, you should replace the placeholder images with actual screenshots of the running application.

## Steps to Generate Screenshots

1.  **Run the Application**:
    Ensure you have Docker Desktop installed and run:
    ```bash
    docker-compose up --build
    ```

2.  **Open the Frontend**:
    Go to `http://localhost:4200` in your browser.

3.  **Take Screenshots**:
    - **Dashboard**: Capture the main "My Claims" page showing the list of claims with AI summaries.
    - Save this image as `dashboard_placeholder.png` inside the `docs/images/` folder (overwrite the existing one if any).

4.  **Commit and Push**:
    ```bash
    git add docs/images/dashboard_placeholder.png
    git commit -m "Add actual application screenshots"
    git push
    ```

## Why this matters?
Recruiters often only look at the `README.md`. Having a visual representation of your work (even a simple dashboard) proves that the code actually runs and produces a UI.
